import { useRef, useState } from 'react';

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

/**
 * Owns the actual WebRTC plumbing: one RTCPeerConnection per remote
 * user, offer/answer exchange, ICE candidates, and the resulting
 * remote video streams. It never touches the socket directly — it's
 * given emitSignal() (from useSocket) as a way to send messages out,
 * so this file has no idea HOW those messages travel, only that they do.
 */
export default function useWebRTC({ socketIdRef, emitSignal }) {
  const connections = useRef({});
  const videoRef = useRef([]);
  const [videos, setVideos] = useState([]);
  const senders = useRef({});

  // ICE candidates that arrived before setRemoteDescription finished —
  // queued per-peer, replayed once the remote description lands.
  const pendingCandidates = useRef({});

  const addOrUpdateVideo = (socketId, stream) => {
    // The exists-check must happen INSIDE the updater, against `prev`.
    // Two tracks (audio + video) can fire `ontrack` back to back in the
    // same tick, before React has flushed the first update — reading
    // videoRef.current outside the updater lets both calls see stale
    // data and both decide "new", producing a duplicate. Checking
    // against `prev` is race-safe because React always feeds the
    // previous queued update's result into the next updater.
    setVideos((prev) => {
      const idx = prev.findIndex((v) => v.socketId === socketId);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = { ...updated[idx], stream };
      } else {
        updated = [...prev, { socketId, stream, autoplay: true, playsinline: true }];
      }
      videoRef.current = updated;
      return updated;
    });
  };

  const removeVideo = (socketId) => {
    connections.current[socketId]?.close();
    delete connections.current[socketId];
    delete pendingCandidates.current[socketId];
    setVideos((prev) => {
      const updated = prev.filter((v) => v.socketId !== socketId);
      videoRef.current = updated;
      return updated;
    });
  };

  // "Here's my SDP, an offer to connect." Guarded by signalingState so
  // we NEVER start a second offer while one is already in flight for
  // this peer — that overlap is exactly what causes browsers to reject
  // the eventual answer with an m-line mismatch.
  const sendOffer = async (id) => {
    const pc = connections.current[id];
    if (!pc) return;
    if (pc.signalingState !== 'stable') {
      console.log('skip offer, already negotiating with', id, pc.signalingState);
      return;
    }
    try {
      pc.makingOffer = true;
      const description = await pc.createOffer();
      await pc.setLocalDescription(description);
      emitSignal(id, JSON.stringify({ sdp: pc.localDescription }));
    } catch (e) {
      console.log('sendOffer error:', e);
    } finally {
      pc.makingOffer = false;
    }
  };

  // Called when the server tells us a user joined (could be us, or someone else)
  const handleUserJoined = (id, clients) => {
    clients.forEach((socketListId) => {
      if (socketListId === socketIdRef.current) return;
      if (connections.current[socketListId]) return; // already connected to them
      
      const pc = new RTCPeerConnection(peerConfigConnections);
      pc.makingOffer = false;
      connections.current[socketListId] = pc;
      pendingCandidates.current[socketListId] = [];
      pc.onsignalingstatechange = () => {
      console.log(`[${socketListId}] signalingState:`, pc.signalingState);
      };
      pc.oniceconnectionstatechange = () => {
        console.log(`[${socketListId}] iceConnectionState:`, pc.iceConnectionState);
      };
      pc.onconnectionstatechange = () => {
        console.log(`[${socketListId}] connectionState:`, pc.connectionState);
      };

      // Every time the ICE layer finds a possible route, ship it to the peer
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          emitSignal(socketListId, JSON.stringify({ ice: event.candidate }));
        }
      };

      // Modern API: fires once per track, not once per stream.
      // event.streams[0] still gives you the combined MediaStream.
      pc.ontrack = (event) => addOrUpdateVideo(socketListId, event.streams[0]);

      if (window.localStream) {
        console.log(`[${socketListId}] localStream ready?`, !!window.localStream);
        const audioTrack = window.localStream.getAudioTracks()[0];
        const videoTrack = window.localStream.getVideoTracks()[0];
        senders.current[socketListId] = {
          audio: audioTrack && pc.addTrack(audioTrack, window.localStream),
          video: videoTrack && pc.addTrack(videoTrack, window.localStream),
        };
      }
    });

    // If the "joined" event is about US, we're the newcomer — so WE
    // send offers to everyone already in the room.
    if (id === socketIdRef.current) {
      for (const id2 in connections.current) {
        if (id2 === socketIdRef.current) continue;
        sendOffer(id2);
      }
    }
  };

  // Called whenever a signaling message (SDP or ICE) arrives from a peer
  const handleSignal = (fromId, message) => {
    const signal = JSON.parse(message);
    console.log("Inside handle Signal", fromId ,  " socketIdRef.current :", socketIdRef.current)
    if (fromId === socketIdRef.current) return;
   console.log("reached cross ")
    const pc = connections.current[fromId];
    if (!pc) return;

    if (signal.sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          // Remote description now exists — flush any ICE candidates
          // that arrived too early and were queued.
          const queued = pendingCandidates.current[fromId] || [];
          queued.forEach((c) => pc.addIceCandidate(c).catch((e) => console.log(e)));
          pendingCandidates.current[fromId] = [];

          if (signal.sdp.type === 'offer') {
            pc.createAnswer()
              .then((description) => {
                pc.setLocalDescription(description).then(() => {
                  emitSignal(fromId, JSON.stringify({ sdp: pc.localDescription }));
                });
              })
              .catch((e) => console.log(e));
          }
        })
        .catch((e) => console.log('setRemoteDescription error:', e));
      return;
    }

    if (signal.ice) {
      const candidate = new RTCIceCandidate(signal.ice);
      if (pc.remoteDescription && pc.remoteDescription.type) {
        pc.addIceCandidate(candidate).catch((e) => console.log(e));
      } else {
        // Remote description isn't set yet — hold onto this candidate.
        pendingCandidates.current[fromId] = pendingCandidates.current[fromId] || [];
        pendingCandidates.current[fromId].push(candidate);
      }
    }
  };

  // Called by useMedia whenever the local stream changes (mute, camera
  // on/off, screen share start/stop) — pushes the new stream to every
  // peer and renegotiates. sendOffer's signalingState guard protects
  // this from colliding with an offer already in flight from
  // handleUserJoined.
  // pushStreamToPeers now REPLACES, never adds again:
const pushStreamToPeers = (stream) => {
  const newAudio = stream.getAudioTracks()[0];
  const newVideo = stream.getVideoTracks()[0];

  for (const id in connections.current) {
    if (id === socketIdRef.current) continue;
    const s = senders.current[id];
    if (s?.audio && newAudio) s.audio.replaceTrack(newAudio);
    if (s?.video && newVideo) s.video.replaceTrack(newVideo);
  }
  // NOTE: no sendOffer() call needed here anymore — replaceTrack
  // swaps the media on the wire without renegotiation, which is
  // exactly why it doesn't create a second offer.
};

  return { videos, handleUserJoined, handleSignal, removeVideo, pushStreamToPeers };
}