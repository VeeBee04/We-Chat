import React, { useEffect, useRef, useState } from 'react'
import { TTypesOfChat } from '../../Types/user'
import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { primary, text } from '../../StyledComponents/Global';
import ReactPlayer from 'react-player';
import WaveSurfer from 'wavesurfer.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { StyleButton } from '../../StyledComponents/Styled';
import { sendMessage, setToast } from '../../Controllers/Controller';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { bucket, db } from '../../services/firebase.config';
import { socket } from '../../socket';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
const AudioShare = ({setType,docRef,uid,setMessages,friendId,setDocRef,refer}:TTypesOfChat) => {
    const [audioUrl,setAudioUrl] = useState<string | null>(null)
    const [isPlay,setIsPlay] = useState(false)
    const waveformRef = useRef<WaveSurfer | null>(null);
    const reactPlayerRef = useRef<ReactPlayer | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const recorderControls = useVoiceVisualizer();
    const {
        // ... (Extracted controls and states, if necessary)
        recordedBlob,
        error,
        audioRef,
        
    } = recorderControls;
    useEffect(() => {
      return () => {
          if (waveformRef.current) {
              waveformRef.current.destroy();
          }
      };
  }, []);

    useEffect(() => {
      if (!recordedBlob) return;
      const url = URL.createObjectURL(recordedBlob)
      setAudioUrl(url)
      setAudioBlob(recordedBlob);
  }, [recordedBlob, error]);

  useEffect(() => {
    if (!error) return;

    console.error(error);
}, [error]);
  
    const handleBack = ()=> {
        setType("text")
        setAudioUrl(null)
        setAudioBlob(null)
        }
        useEffect(() => {
            if (audioUrl) {
              const wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: text,
                progressColor: primary,
                url: audioUrl,
                height:40,
                cursorWidth:2,
                cursorColor:text
              });
              waveformRef.current = wavesurfer;
              waveformRef.current.on('finish', () => {
                setIsPlay(false);
                waveformRef.current?.stop();
                waveformRef.current?.seekTo(0);
            });
            }
          }, [audioUrl]);
        useEffect(() => {
            waveformRef.current?.on('audioprocess', (progress: number) => {
              if (waveformRef.current) {
                reactPlayerRef.current?.seekTo(progress / waveformRef.current.getDuration());
              }

            });
          }, [waveformRef, reactPlayerRef]);
          const handlePlay = () => {
            if (waveformRef.current && !isPlay) {
              waveformRef.current.play();
            }
            else {
                waveformRef.current?.pause()
            }
            setIsPlay(!isPlay)
          }
          const sendAudio = async(docRef:any,uid:string,audioUrl:string,type:string)=> {
            const send:boolean = await sendMessage(docRef,uid,audioUrl,type)
            if(send) {
              // const currDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
              const message = {
                from:uid,
                content:audioUrl,
                type:"audio",
                timestamp:Timestamp.fromDate(new Date())
              }
              // console.log(send)
              
              setMessages(prevMessages => prevMessages ? [message,...prevMessages] : [message]);
              refer.current?.scrollTo(0,refer.current?.scrollHeight)
              if(socket.connected) {
                socket.emit("send_message",{uid:friendId,message})
                socket.emit("notTyping",{uid:friendId})
              }
              setAudioUrl("")
              setType("text")
            }
            else {
              setToast("Something went wrong!","error")
            }
          }
          const shareAudio = async()=> {
            const generateUrl = `Imgs/${v4()}`
            const storageRef = ref(bucket, generateUrl);
            let url: string | undefined;
            if(audioBlob)
            await uploadBytes(storageRef, audioBlob).then(async (data) => {
                console.log(data)
                url = await getDownloadURL(data.ref)
            })
            if(docRef) {
                sendAudio(docRef,uid,url || "","audio")
              }
              else {
                const docRef = doc(db,"conversations",`${uid}_${friendId}`)
                await setDoc(docRef,{user1:uid,user2:friendId},{merge:true}).then(async()=>{
                  sendAudio(docRef,uid,url || "","audio")
                  setDocRef(docRef)
                })
              }
          }
  return (
    <Box sx={{width:"100%",height: "85vh",backgroundColor:`${primary}`}}>
        <Box sx={{padding:"24px",height:"inherit"}}>

        <ArrowBackIcon onClick={()=>handleBack()} sx={{cursor:"pointer"}}/>
        <Box sx={{display:'flex',height:"90%",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"20px",position:"relative"}}>
       {
        !audioUrl && <VoiceVisualizer ref={audioRef} controls={recorderControls} mainBarColor={text} secondaryBarColor='maroon' width={"250px"} height={"100px"} backgroundColor='black'/>
       } 
    {
        audioUrl && <Box sx={{display:"flex", alignItems:"center",gap:"10px",padding:"20px",border:"2px dashed"}}>
        <Box id="waveform" sx={{width:"200px"}}>
            
            </Box>
            <Button onClick={() => handlePlay()} sx={{borderRadius:"50%",width:"35px",height:"35px",minWidth:"unset"}}>{isPlay?<PauseIcon/>:<PlayArrowIcon/>} </Button>
            </Box>
    }
    {
        audioUrl && <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
            <StyleButton style={{backgroundColor:"gray"}} onClick={()=>{setAudioUrl(null); setAudioBlob(null)}}>Retake</StyleButton>
            <StyleButton onClick={shareAudio}>Share</StyleButton>
            </Box>
    }
    </Box>
        </Box>
    </Box>
  )
}

export default AudioShare