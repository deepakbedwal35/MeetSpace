


import React from 'react';
 
// One video tile — shared visual language for local + remote so the
// grid reads as one system, not "my video" + "everyone else."
export function VideoTile({ videoRef, stream, label, muted, mirrored }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/10">
      <video
        ref={(el) => {
          if (!el) return;
          if (videoRef) videoRef.current = el;
          if (stream) el.srcObject = stream;
        }}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
      />
      {label && (
        <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-zinc-100 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
 
export default function RemoteVideos({ videos }) {
  return (
    <>
      {videos.map((video) => (
        <VideoTile key={video.socketId} stream={video.stream} label={video.socketId.slice(0, 6)} />
      ))}
    </>
  );
}