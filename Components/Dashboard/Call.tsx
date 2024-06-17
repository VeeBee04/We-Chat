import React, { useEffect, useState } from 'react'
import { getUser } from '../../Controllers/Controller'
import { Avatar, Box } from '@mui/material'
import { StyledText } from '../../StyledComponents/Styled'
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { label, primary } from '../../StyledComponents/Global';
import Link from 'next/link';

type Props = {
    friendId:string
  }
const Call = ({friendId}:Props) => {
    const [fFirstName,setFFirstName] = useState("")
    const [fLastName,setFLastName] = useState("")
    const [fDp,setFDp] = useState("")
    // const [fBio,setFBio] = useState("")
    // const [fDob,setFDob] = useState("")
    // const [fEmail,setFEmail] = useState("")
    // const [fGender,setFGender] = useState("")
    // const [fPhone,setFPhone] = useState("")
    // const [fTimeStamp,setFTimestamp] = useState<Date>(new Date())
    useEffect(()=> {
        const fetchUser = async()=> {
            if(friendId) {
                const data = await getUser(friendId)
                if(data) {
                    // const {firstName,lastName,email,phone,dob,bio,photoURL,timestamp,gender} = data
                    const {firstName,lastName,photoURL} = data
                    setFFirstName(firstName)
                    setFLastName(lastName)
                    setFDp(photoURL)
                    // setFBio(bio)
                    // setFDob(dob)
                    // setFEmail(email)
                    // setFGender(gender)
                    // setFPhone(phone)
                    // setFTimestamp(timestamp)
                }
            }
        }
        fetchUser()
     
    },[friendId])
    return (
      <Box component={Link} href={`/dashboard/call/${friendId}`} sx={{color:`${label}`,textDecoration:"none",width:"100%",display:"flex",zIndex:3,alignItems:"center",height:"8vh",cursor:"pointer",borderRadius:"10px",'&:hover': { backgroundColor: `${primary}`,transition:"all 0.2s" }}}>
  
      <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"15%",height:"100%"}}>
  
    <Avatar src={fDp}/>
      </Box>
    <Box sx={{width:"75%",height:"100%",alignItems:"center",display:"flex",cursor:"pointer"}}>
      <StyledText style={{fontSize:"14px",margin:"0px"}}>{fFirstName} {fLastName}</StyledText>
    </Box>
    <Box sx={{width:"10px",height:"100%",display:"flex",alignItems:"center",cursor:"pointer"}}>
      <AddIcCallIcon/>
    </Box>
      </Box>
    )
}

export default Call