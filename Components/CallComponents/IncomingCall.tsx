import { Box } from '@mui/system'
import React from 'react'
import { dark, primary } from '../../StyledComponents/Global'
import { socket } from '../../socket'
import { Avatar, Fab, Typography } from '@mui/material'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useAuth } from '../../context/AuthContext'
import { useCall } from '../../context/CallContext'
import { useRouter } from 'next/navigation'
import { setToast } from '../../Controllers/Controller'
import Peer from "simple-peer";

const IncomingCall = () => {
    const router = useRouter()
    const {uid} = useAuth()
    const {caller,setIncomingCall,callerDp,callerName,setCallerDp,setCallerName,setCallAccepted,setRecStream,callerSignal,setMyStream,setRecPeer} = useCall()
    const handleReject = () => {
        console.log("call rejected")
        setIncomingCall(false)
        setCallerDp("")
        setCallerName("")
        if(socket.connected) {
            socket.emit("rejectCall",{me:uid,caller})
        }
    }
    const handleAccept = () => {
        console.log("call accepted");
        setCallAccepted(true);
      
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: { max: 640 }, height: { max: 480 }, frameRate: { max: 10 } }
        })
        .then((stream) => {
          console.log("Stream:", stream);
          setMyStream(stream);
        //   setRecStream(stream);
      
          const peer = new Peer({ initiator: false, trickle: false,config: {

            iceServers: [
                {
                    urls: "stun:numb.viagenie.ca",
                    username: "sultan1640@gmail.com",
                    credential: "98376683"
                },
                {
                    urls: "turn:numb.viagenie.ca",
                    username: "sultan1640@gmail.com",
                    credential: "98376683"
                }
            ]
        }, stream });
        // console.log(peer.connected)
        setRecPeer(peer)
        peer.signal(callerSignal);
          peer.on("error", (err) => {
            console.log("Peer error:", err);
          });
      
          peer.on("signal", data => {
            console.log("Signal event triggered");
            if(socket.connected) {
              socket.emit("acceptCall", { caller, signalData: data });
            } else {
              console.log("Socket not connected");
            }
          });
          peer.on("stream",(stream)=> {
            // console.log("stream",stream)
            setRecStream(stream)
          
          })
          console.log("yooooo")
        })
        .catch((err) => {
          console.log("getUserMedia error:", err);
          setToast("Please allow the permissions to make a call", "error");
        });
        
        router.push(`/dashboard/call/${caller}`);
      }
  return (
    <>
    <Box sx={{maxWidth:"300px",width:"300px",height:"450px",backgroundColor:dark,position:"fixed",top:"0px",right:"0px",display:"flex",flexDirection:"column",borderTopLeftRadius:"14px",borderBottomLeftRadius:"14px",justifyContent:"space-around",alignItems:"center",zIndex:2}}>
        <h2 style={{color:"white"}}>Incoming Call</h2>
        <Avatar src={callerDp} sx={{width:"130px",height:"130px"}}/>
        <Typography sx={{color:primary,fontSize:"18px"}}>{callerName}</Typography>
        {/* <Typography sx={{color:primary,fontSize:"18px"}}>Apurba Koley</Typography> */}
        <Box sx={{display:'flex',gap:"40px"}}>
        <Fab sx={{backgroundColor:"red"}} aria-label="add">
        <PhoneDisabledIcon sx={{color:"white",":hover":{color:"red"}}} onClick={handleReject}/>
   
    </Fab>
        <Fab sx={{backgroundColor:"green"}} aria-label="add">
        <LocalPhoneIcon sx={{color:"white",":hover":{color:"green"}}} onClick={handleAccept}/>
   
    </Fab>
        </Box>

    </Box>
    </>
  )
}

export default IncomingCall