import React, { useEffect, useState } from 'react'
import {easeInOut, motion, useAnimation} from 'framer-motion'
import {StyleButton, StyledSubTitle, StyledText,MotionStyledTitle } from '../../StyledComponents/Styled'
import Stack from '@mui/material/Stack';
import { Avatar, FormControl} from '@mui/material';
import { text} from '../../StyledComponents/Global';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import { MuiPhone } from './MuiPhone';
import {signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../../services/firebase.config';
import { useRouter } from 'next/navigation';
import { sendOtp, setToast } from '../../Controllers/Controller';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useProfile } from '../../context/ProfileContext';
import { useChat } from '../../context/ChatContext';

const LoginPage = () => {
  const {setSenderColor,setRecieverColor,setBgType,setBgImage,setBgColor} = useProfile()
  const {setFriends,setFriendCount} = useChat()
      const router = useRouter()
      const controls = useAnimation();
      const [muiPhone, setMuiPhone] = useState("+91");
      useEffect(() => {
        const flickerAnimation = async () => {
          await controls.start({
            opacity: 1,
            scale: 1.05,
            transition: { duration: 0.25, ease: easeInOut },
          });
    
          controls.start({
            y: 0,
            scale: 1, 
            transition: { delay:0.4,duration: 1, ease: easeInOut },
          });
        };
    
        flickerAnimation();
      }, [controls]);

      const handleGoogleSignIn = () => {
        signInWithPopup(auth,provider).then(async (data)=> {
          const {uid} = data.user
         
          console.log("login complete")
          const friendRef = doc(db,"friends",uid)
          const friendSnap = await getDoc(friendRef)
          const friendReqRef = doc(db,"friendRequests",uid)
          const reqSnap = await getDoc(friendReqRef)
          if(!reqSnap.exists()) {
            setDoc(friendReqRef,{uid,requests:[]},{merge:true})
          }
          if(friendSnap.exists()) {
            const {friendsArr,count} = friendSnap.data()
            console.log(friendsArr)
            setFriends(friendsArr)
            setFriendCount(count)
          }
          else {
            setDoc(friendRef,{friendsArr:[],count:0,user:uid},{merge:true})
          }
          const bgRef = doc(db,"backgrounds",uid)
          const bgSnap = await getDoc(bgRef);
          if(bgSnap.exists()){
            const {sendercolor,recieverColor,bgType,bgColor,bgImage} = bgSnap.data();
            console.log({sendercolor,recieverColor,bgType,bgColor,bgImage})
            setSenderColor(sendercolor)
            setRecieverColor(recieverColor)
            setBgType(bgType)
            if(bgType==='Aesthetic'){
              setBgImage(bgImage)
            }
            else {
              setBgColor(bgColor)
            }
            router.push('/dashboard')
          }
          else {
            router.push('/profile')
          }
          
        })
      }
      const handleOtp = async(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        ev.preventDefault()
        await sendOtp(muiPhone).then((res)=> {
          if(res.success) {
            router.push('/auth/verifyOtp')
          }
          else {
            if(res.error) {
              setToast(res.error,"error")
            }
            
          }
        })        
      }
      
  return (
    <>
    
   
    <Stack style={{height:"100vh","alignItems":"center",justifyContent:"center",position:"relative"}} spacing={5}>
      <MotionStyledTitle 
      initial={{ opacity: 0, y: "50%" }} animate={controls}>
    We Chat
    </MotionStyledTitle>
    <motion.div style={{display:"flex",alignItems:"center",flexDirection:"column",margin:"0"}}
    initial={{opacity:0}}
    animate={{
        opacity: 1,
      }}
      
      transition={{
        delay:1,
        duration:1
      }}>
    <StyledSubTitle>Login</StyledSubTitle>
      <StyledText>Login using Google</StyledText>
      <Avatar sx={{ bgcolor: text,cursor:"pointer",marginBottom:"20px" }} onClick={handleGoogleSignIn}><GoogleIcon/></Avatar>
     <p >OR</p>
      <Stack spacing={5} style={{height:"40vh"}}>
      <form style={{display:"flex",width:"100%",height:"100%",flexDirection: "column",justifyContent: "space-evenly",alignItems:"center"}}>
        <FormControl>
<MuiPhone value={muiPhone} onChange={setMuiPhone} style={{minWidth:"250px"}}/>
        </FormControl>
      <StyleButton type="submit" onClick={(ev)=>handleOtp(ev)}>Login</StyleButton>
    <p>Dont have an Account? <Link href={"/auth/signup"}>Register</Link></p>
    </form>
      </Stack>
    </motion.div>
    <div id="recaptcha" style={{position:"absolute",bottom:"10%",right:"10%"}}></div>
    </Stack>
    
</>
  )
}

export default LoginPage
