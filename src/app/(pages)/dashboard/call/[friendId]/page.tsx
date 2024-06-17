"use client"
import React, { useEffect, useRef, useState } from 'react'
import { setToast } from '../../../../../../Controllers/Controller'
import { Box } from '@mui/material'
import StreamBox from '../../../../../../Components/CallComponents/StreamBox'
import StreamButtons from '../../../../../../Components/CallComponents/StreamButtons'
import Peer from "simple-peer";
import { socket } from '../../../../../../socket'
import { useAuth } from '../../../../../../context/AuthContext'
import { useProfile } from '../../../../../../context/ProfileContext'
import { dark } from '../../../../../../StyledComponents/Global'
import { useCall } from '../../../../../../context/CallContext'
import { useRouter } from 'next/navigation'
type CallScreenProps = {
    params: {
    friendId: string;
    };
}
const CallScreen = ({params}:CallScreenProps) => {
    const {friendId} = params
    const {uid} = useAuth()
    const {firstName,lastName,dp} = useProfile()
    const {myStream,setMyStream,setRecStream,recStream,setMyPeer} =useCall()
    const router = useRouter()
    // eslint-disable-next-line no-unused-vars
    const [muteMic,setMuteMic] = useState<boolean>(false)
    const [muteVid,setMuteVid] = useState<boolean>(false)
    const myStreamRef = useRef<HTMLVideoElement>(null)
    const recStreamRef = useRef<HTMLVideoElement>(null)
    useEffect(()=> {
        console.log({myStream,recStream})
    },[recStream,myStream])
    useEffect(()=> {
        if(!myStream) {
            navigator.mediaDevices.getUserMedia({audio:true, video: { width: { max: 640 }, height: { max: 480 },frameRate: { max: 10 } }}).then((stream)=> {
                 console.log(stream)
                 setMyStream(stream)
                if(myStreamRef.current) {
                    myStreamRef.current.srcObject = stream
                   
                }
             
             }).catch(()=> {
                 setToast("Please allow the permissions to make a call","error")
             })

        }
        else {
            if(myStream && myStreamRef.current) {
                myStreamRef.current.srcObject = myStream
            }
        }
        if(recStream && recStreamRef.current) {
            recStreamRef.current.srcObject = recStream
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

useEffect(()=> {
    if(recStream && recStreamRef.current) {
        recStreamRef.current.srcObject = recStream
    }
},[recStream])
    useEffect(() => {
        let peer: Peer.Instance | undefined;
        if (myStream) {
            peer = new Peer({
                initiator: true,
                trickle: false,
                config: {
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
                },
                stream: myStream,
            });
            setMyPeer(peer);
            peer.on("signal", data => {
                console.log({ myStream, data });
                console.log("calling user");
                socket.emit("callUser", { userToCall: friendId, signalData: data, from: uid, profileData: { name: `${firstName} ${lastName}`, dp } });
            });
            peer.on("stream", stream => {
                console.log(stream);
                setRecStream(stream);
                if (recStreamRef.current) {
                    recStreamRef.current.srcObject = stream;
                }
            });
            socket.on("call_accepted", signal => {
                console.log(signal);
                if(peer)
                peer.signal(signal);
            });
        }
    
        return () => {
            socket.off("callUser");
            socket.off("call_accepted");
            if (peer) {
                peer.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myStream]);
    useEffect(()=>{
        
        if(socket.connected) {
            socket.on("busy_call",(data)=> {
                console.log("user busy")
                setToast(`${data} is busy` ,"error")
            
            })
            socket.on("call_rejected",(data)=> {
                console.log("call rejected")
                setTimeout(() => {
                    router.back()
                }, 1500);
                setToast(`${data} rejected the call` ,"error")
            })
            socket.on("call_ended",()=> {
                console.log("call ended")
                window.location.href = '/dashboard'
            })
        }
        else {
            socket.connect()
        }
        return ()=> {
            socket.off("busy_call")
            socket.off("call_rejected")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket])

    useEffect(() => {
        if (myStream) {
            myStream.getAudioTracks().forEach(track => {
                track.enabled = !muteMic;
            });
        }
    }, [muteMic, myStream]);

    useEffect(() => {
        if (myStream) {
            myStream.getVideoTracks().forEach(track => {
                track.enabled = !muteVid;
            });
        }
    }, [muteVid, myStream]);


  return (
    <>
    <Box sx={{width:"100%",height:"100%",backgroundColor:dark,display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
        <StreamBox streamRef={myStreamRef} muteMic={muteMic} muteVid={muteVid}/>
        {/* {recStream!==null && <StreamBox streamRef={recStreamRef} muteMic={muteMic} muteVid={muteVid}/>} */}
       <StreamBox streamRef={recStreamRef}/>
        <StreamButtons muteMic={muteMic} setMuteMic={setMuteMic} muteVid={muteVid} setMuteVid={setMuteVid} friendId={friendId}/>
    </Box>
    </>
  )
}

export default CallScreen