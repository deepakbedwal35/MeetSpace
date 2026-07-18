import {useEffect , useRef, useState} from "react"; 
import { toast } from "react-hot-toast";

// A silent audio track — used so we still have SOMETHING to send
// to peers when the user turns audio off, instead of removing the
// track entirely (which would require full renegotiation).
const silence = ()=>{
    const ctx = new AudioContext();
    // osscilator genrate const tone
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
};
const black = ({width = 640, height= 480}={})=>{
    const canvas = Object.assign(document.createElement('canvas'),{width, height});
    canvas.getContext('2d').fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], {enabled: false});

}
export default function useMedia({onStreamChange}){
    const localVideoref = useRef();
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);
     const [video, setVideo] = useState();
    const [audio, setAudio] = useState();
    const [screen, setScreen] = useState();

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            // if (navigator.mediaDevices.getDisplayMedia) {
            //     setScreenAvailable(true);
            // } else {
            //     setScreenAvailable(false);
            // }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
     useEffect(() => {
        getPermissions();
    }, []);

  

    const  applyStream = (stream)=>{
        window.localStream?.getTracks().forEach((t)=>t.stop());
        window.localStream = stream;
        if(localVideoref.current) localVideoref.current.srcObject = stream;
        onStreamChange(stream);
    }
    const fallbackToBlackSilence = ()=>{
        try{
            localVideoref.current.srcObject.getTracks()
            .forEach((t)=>t.stop());
        }catch(e){}
        applyStream(new MediaStream([black(), silence()]));
    }
    const getUserMediaStream =()=>{
        if((video && videoAvailable)||(audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video, audio})
            .then((stream)=>{
                applyStream(stream);
                stream.getTracks().forEach((track)=>{
                    track.onended = ()=>{
                        setVideo(false);
                        setAudio(false);
                        fallbackToBlackSilence();
                    }
                })
            })
            .catch((err)=>{console.log(err)})
        }
        else{
            try{
                localVideoref.current.srcObject.getTracks()
                .forEach(t => t.stop());
            }catch(e){}
        }
    }
    useEffect(()=>{
        if(video != undefined && audio != undefined){
            getUserMediaStream();
        }
    },[audio, video]);


    const startMedia = async()=>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video:videoAvailable,
                audio:audioAvailable
            })
             applyStream(stream);
             onStreamChange(stream);
            setVideo(videoAvailable);
            setAudio(audioAvailable);
            return stream;

        }catch(e){console.log("startMedia error :", e)}
        console.log("i am inside start media");
        console.log("VideoAvaliable? ", videoAvailable ,"audiAvail" , audioAvailable)
        
    }
     const toggleVideo = ()=>{
        toast.success("video toggle button clicks")
        // const track = window.localStream?.getVideoTracks()[0];
        // if(!track) return;
        // track.enabled = !track.enabled;
        setVideo(!video);
     }

      const toggleAudio = ()=>{
        toast.success("Audio toggle button clicks")
        // const track = window.localStream?.getAudioTracks()[0];
        // if(!track) return;
        // track.enabled = !track.enabled;
        // setAudio(track.enabled);
        setAudio(!audio);
     }

     const handleEndCall =()=>{
        toast.success("end call")
        try{
            localVideoref.current.srcObject.getTracks().forEach((t)=>t.stop());


        }catch(e){}
        window.location.href = '/';
     }
    return {
        videoAvailable, audioAvailable, localVideoref,video, audio,
        startMedia, toggleVideo, toggleAudio, handleEndCall
    }
}