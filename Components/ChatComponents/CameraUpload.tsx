import React, { useState } from 'react'
import {TTypesOfChat } from '../../Types/user';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { primary } from '../../StyledComponents/Global';
import { title } from 'process';
import MyWebCam from './MyWebCam';
import Image from 'next/image';
import { StyleButton } from '../../StyledComponents/Styled';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { sendMessage, setToast } from '../../Controllers/Controller';
import { socket } from '../../socket';

const CameraUpload = ({setDocRef,docRef,friendId,setMessages,setType,uid,refer}:TTypesOfChat) => {
    const [imgSrc,setImgSrc] = useState<string>("")
    const handleBack = ()=> {
      setImgSrc("")
      setType("text")
      }
      const sendImg = async(docRef:any,uid:string,searchValue:string,type:string)=> {
        const send = await sendMessage(docRef,uid,searchValue,type)
        if(send) {
          // console.log(searchValue)
          const message = {
            from:uid,
            content:searchValue,
            type:"camera",
            timestamp:Timestamp.fromDate(new Date())
          }
          console.log(message)
          
          setMessages(prevMessages => prevMessages ? [message,...prevMessages] : [message]);
          refer.current?.scrollTo(0,refer.current?.scrollHeight)
          if(socket.connected) {
            socket.emit("send_message",{uid:friendId,message})
            socket.emit("notTyping",{uid:friendId})
          }
          setImgSrc("")
          setType("text")
        }
        else {
          setToast("Something went wrong!","error")
        }
      }

      const uploadImg = async() => {
        if(docRef) {
          sendImg(docRef,uid,imgSrc,"camera")
        }
        else {
          const docRef = doc(db,"conversations",`${uid}_${friendId}`)
          await setDoc(docRef,{user1:uid,user2:friendId},{merge:true}).then(async()=>{
            sendImg(docRef,uid,imgSrc,"camera")
            setDocRef(docRef)
          })
        }
      }

  return (
    <Box sx={{width:"100%",height: "85vh",backgroundColor:`${primary}`}}>
        <Box sx={{padding:"24px",height:"inherit"}}>

        <ArrowBackIcon onClick={()=>handleBack()} sx={{cursor:"pointer"}}/>
       <Box sx={{display:'flex',height:"90%",alignItems:"center",justifyContent:"center",border:`2px dashed ${title}`,flexDirection:"column",gap:"20px",position:"relative"}}>
        {
            imgSrc===""
            ?
            <MyWebCam setImgSrc={setImgSrc} imgSrc={imgSrc}/>
            :
            <Image src={imgSrc} alt='camera' width={640} height={480}/>
        }
        {imgSrc!==""?
        <Box sx={{display:'flex',gap:"20px"}}>
        <StyleButton style={{backgroundColor:"slategray"}} onClick={()=>setImgSrc("")}> Retake</StyleButton>
        <StyleButton onClick={uploadImg}> Send</StyleButton>
        </Box>:
        null}
        </Box>
        </Box>
    </Box>
  )
}

export default CameraUpload