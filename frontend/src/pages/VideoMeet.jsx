import React, { use, useEffect, useRef, useState } from 'react'
import Lobby from '../components/videoMeet/Lobby';
import useMedia from "../hooks/useMedia"
import { toast } from 'react-hot-toast';
import useSocket from '../hooks/useSocket';
import { set } from 'react-hook-form';
import useWebRTC from '../hooks/useWebRTC';
import RemoteVideos, {VideoTile} from '../components/videoMeet/RemoteVideos';
import ActionControls from '../components/videoMeet/ActionControls';
import ChatPanel from "../components/videoMeet/ChatPanel";
export default function VideoMeet(){
    // useSocket needs callbacks that call INTO useWebRTC (handleSignal,
    // handleUserJoined...). But useWebRTC needs socketIdRef/emitSignal,
    // which only exist AFTER useSocket runs. Neither hook can be declared
    // first. Fix: give useSocket small wrapper functions that read from
    // a ref, and fill that ref in on every render, after webrtc exists.
    // The ref is always up to date by the time any real socket event
    // fires, because sockets are asynchronous.

   let [askForUsername, setAskForUsername] = useState(true);
    let [messages, setMessages] = useState(true);
    let [username, setUsername] = useState("");
    const handlerRef = useRef({});

    const {connectToSocketServer , socketIdRef, emitSignal} =
    useSocket({
        onSignal:(fromId, msg)=>handlerRef.current.onSignal(fromId, msg),
        // onChatMessage, 
        onUserJoined :(id, clients)=>handlerRef.current.onUserJoined(id, clients),
        onUserLeft:(id)=>handlerRef.current.onUserLeft(id),
         
    })

   const webrtc = useWebRTC({socketIdRef, emitSignal});
   useEffect(() => {
        handlerRef.current.onSignal = webrtc.handleSignal;
        handlerRef.current.onUserJoined = webrtc.handleUserJoined;
        handlerRef.current.onUserLeft = webrtc.removeVideo;
    }, [webrtc.handleSignal, webrtc.handleUserJoined, webrtc.removeVideo]);

    const media = useMedia({
        onStreamChange: (stream)=>webrtc.pushStreamToPeers(stream)});
   
    const handleConnect = async()=>{
        setAskForUsername(false);
        media.startMedia();
        connectToSocketServer()
    }
   
    if(askForUsername){
        return <Lobby
            username={username}
            setUsername={setUsername}
            onJoin={handleConnect}
            videoAvailable={media.videoAvailable}
            localVideoref={media.localVideoref}
        />
    }
    return (
        <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-zinc-950">
            <div className="relative flex-1 p-3">
                <div
                className="
                    grid h-full gap-3 auto-rows-fr
                    grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
                "
                >
                    <VideoTile videoRef={media.localVideoref} label="You" muted mirrored />
                    <RemoteVideos videos={webrtc.videos}/>
                </div >
                <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
                        <ActionControls video={media.video} 
                            audio={media.audio}
                            // screen={media.screen} 
                            onToggleVideo={media.toggleVideo}
                            onToggleAudio={(media.toggleAudio)}
                            onEndCall ={media.handleEndCall}
                            onToggleChat={()=>toast.success("Chat is shown")}          
                        />
                </div>

            </div>
           
           <div
        className={`
          shrink-0 overflow-hidden border-l border-white/10 bg-zinc-900
          transition-[width] duration-200 ease-out
         
        `}
      >
        <div className="flex h-full w-80 flex-col">
          <ChatPanel
            // messages={{}}
            // message={{}}
            // onMessageChange={(e) => toast.success("setting maessage")}
            // onSend={() => {
            //     console.log("Sending chat message")
            // //   sendChatMessage(message, username);
            // //   setMessage('');
            // }}
          />
        </div>
      </div>
     

        </div>
    )
}