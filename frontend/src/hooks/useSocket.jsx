import server from "../environment.js";
import {useRef} from "react";
import io from 'socket.io-client';

export default function useSocket({onSignal , onUserJoined, onUserLeft}){
     const socketRef= useRef();
     const socketIdRef = useRef();

     const connectToSocketServer = ()=>{
        socketRef.current = io.connect(server, {secure:false});
       // Someone sent us an SDP offer/answer or an ICE candidate
        socketRef.current.on('signal', onSignal);
      
        socketRef.current.on('connect',()=>{
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;
           console.log("connect succesfully",  socketIdRef.current)
            // socketRef.current.on('chat-message', onChatMessage);
            socketRef.current.on('user-left',onUserLeft);
            socketRef.current.on('user-joined',onUserJoined);
            console.log("usrejoined handle correctly")
        })
    }
    const emitSignal = (toId, message)=>{
        console.log("message", toId)
        socketRef.current.emit('signal', toId , message);
        console.log("signal emit ")
    }
    // const sendChatMessage = (message, username)=>{
    //     socketRef.current.emit('chat-message', toId, message);
    // }
    return {
        connectToSocketServer, socketIdRef, emitSignal,
        // sendChatMessage
    }
}