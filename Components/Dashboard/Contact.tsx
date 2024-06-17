import { Avatar, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledText } from '../../StyledComponents/Styled'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from 'next/link';
import { label, primary } from '../../StyledComponents/Global';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';

type Props = {
  friendId:string
}
const Contact = ({friendId}:Props) => {
  const [fFirstName,setFFirstName] = useState("")
  const [fLastName,setFLastName] = useState("")
  const [fDp,setFDp] = useState("")
  const [fBio,setFBio] = useState("")
  const [fDob,setFDob] = useState("")
  const [fEmail,setFEmail] = useState("")
  const [fGender,setFGender] = useState("")
  const [fPhone,setFPhone] = useState("")
  const [fTimeStamp,setFTimestamp] = useState("")
  useEffect(()=> {
    if(friendId) {
      const userRef = doc(db,"user",friendId)
      getDoc(userRef).then((data)=> {
        if(data.exists()) {

          const {firstName,lastName,email,phone,dob,bio,photoURL,timestamp,gender} = data.data()
          setFFirstName(firstName)
          setFLastName(lastName)
          setFDp(photoURL)
          setFBio(bio)
          setFDob(dob)
          setFEmail(email)
          setFGender(gender)
          setFPhone(phone)
          setFTimestamp(timestamp)
        }
      })
    }
  },[friendId])
  return (
    <Box component={Link} href={{pathname:`/dashboard/${friendId}`,query:{fFirstName,fLastName,fBio,fDob,fDp,fEmail,fGender,fPhone,fTimeStamp}}} passHref sx={{color:`${label}`,textDecoration:"none",width:"100%",display:"flex",zIndex:3,alignItems:"center",height:"8vh",cursor:"pointer",borderRadius:"10px",'&:hover': { backgroundColor: `${primary}`,transition:"all 0.2s" }}}>

    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"15%",height:"100%"}}>

  <Avatar src={fDp}/>
    </Box>
  <Box sx={{width:"75%",height:"100%",alignItems:"center",display:"flex",cursor:"pointer"}}>
    <StyledText style={{fontSize:"14px",margin:"0px"}}>{fFirstName} {fLastName}</StyledText>
  </Box>
  <Box sx={{width:"10px",height:"100%",display:"flex",alignItems:"center",cursor:"pointer"}}>
    <KeyboardDoubleArrowRightIcon/>
  </Box>
    </Box>
  )
}

export default Contact