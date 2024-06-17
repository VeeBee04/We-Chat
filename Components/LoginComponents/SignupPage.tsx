"use client";
import React, { useEffect, useState } from 'react'
import {easeInOut, motion, useAnimation} from 'framer-motion'
import {StyleButton, StyledSubTitle, StyledText, MotionStyledTitle } from '../../StyledComponents/Styled'
import Stack from '@mui/material/Stack';
import { Avatar, FormControl} from '@mui/material';
import { text} from '../../StyledComponents/Global';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import { MuiPhone } from './MuiPhone';
import {signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../services/firebase.config';
import { useRouter } from 'next/navigation';
import {sendOtp, setToast } from '../../Controllers/Controller';


const SignupPage = () => {
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
        signInWithPopup(auth,provider).then((data)=> {
          router.push('/dashboard')
          
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
      <MotionStyledTitle initial={{ opacity: 0, y: "50%" }} animate={controls}>
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
    <StyledSubTitle>Signup</StyledSubTitle>
      <StyledText>Signup using Google</StyledText>
      <Avatar onClick={handleGoogleSignIn} sx={{ bgcolor: text,cursor:"pointer",marginBottom:"20px" }}><GoogleIcon/></Avatar>
     <p style={{marginBottom:"40px"}}>OR</p>
      <Stack spacing={5} style={{height:"40vh"}}>
      <form style={{display:"flex",width:"100%",height:"100%",flexDirection: "column",justifyContent: "space-evenly",alignItems:"center"}}>
        <FormControl>
        <MuiPhone value={muiPhone} onChange={setMuiPhone} style={{minWidth:"250px"}}/>
        </FormControl>
      <StyleButton type="submit" onClick={(ev)=>handleOtp(ev)}>Signup</StyleButton>
    <p>Already have an Account? <Link href={"/auth/login"}>Login</Link></p>
    </form>
      </Stack>
    </motion.div>
      <div id="recaptcha" style={{position:"absolute",bottom:"10%",right:"10%"}}></div>
    </Stack>
    </>
  )
}

export default SignupPage
