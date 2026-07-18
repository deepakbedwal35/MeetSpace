import React from 'react';
import { Badge, IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import { toast } from 'react-hot-toast';

// function Pill({ active, danger, children, onClick, badge }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         relative flex h-12 w-12 items-center justify-center rounded-full
//         transition-colors duration-150
//         ${danger
//           ? 'bg-red-500 hover:bg-red-400 text-white'
//           : active === false
//           ? 'bg-red-500/90 hover:bg-red-400 text-white'
//           : 'bg-white/10 hover:bg-white/20 text-zinc-100'}
//       `}
//     >
//       {children}
//       {badge > 0 && (
//         <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-semibold text-zinc-900">
//           {badge > 9 ? '9+' : badge}
//         </span>
//       )}
//     </button>
//   );
// }
export default function ActionControls({
    isLobby = false,
    video,
  audio,
//   screen ,
//   screenAvailable,
//   newMessages,
  onToggleVideo,
  onToggleAudio,
//   onToggleScreen,
  onEndCall,
  onToggleChat,
}
){

    return(
       <div
      className="
        pointer-events-auto flex items-center gap-3 rounded-full
        bg-zinc-900/80 backdrop-blur-md px-6 py-4
        shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/10
      "
    >
         
        <div className="border border-neutral-900 bg-neutral-900 hover:border-white/20 w-fit rounded-lg hover:bg-black hover:border">
            <IconButton 
            onClick={onToggleVideo} style={{ color: 'white' }}>
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
        </div>
      
        {!isLobby && <div className="border border-neutral-900 bg-neutral-900 hover:border-white/20 w-fit rounded-lg hover:bg-black hover:border">
        
            <IconButton onClick={onEndCall} style={{ color: 'red' }}>
                <CallEndIcon />
            </IconButton>
        </div>}
        <div className="border border-neutral-900 bg-neutral-900 hover:border-white/20 w-fit rounded-lg hover:bg-black hover:border">  
            <IconButton onClick={onToggleAudio} style={{ color: 'white' }}>
                {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
        </div>
 
      {/* {screenAvailable && (
        <IconButton onClick={onToggleScreen} style={{ color: 'white' }}>
          {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </IconButton>
      )} */}
 
      {!isLobby && <Badge  badgeContent={""} max={999}  color="warning">
        <div className="border border-neutral-900 bg-neutral-900 hover:border-white/20 w-fit rounded-lg hover:bg-black hover:border">
            <IconButton onClick={()=>{onToggleChat ; toast.success("click on msg icon")}} style={{ color: 'white' }}>
            <ChatIcon />
            </IconButton>
        </div>
      </Badge>}
    </div>

    )
}