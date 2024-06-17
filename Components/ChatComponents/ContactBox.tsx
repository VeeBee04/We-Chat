import React, { useEffect } from 'react'
import { TContact } from '../../Types/user'
import { Avatar, Box, Button, Typography } from '@mui/material';
import { StyleButton } from '../../StyledComponents/Styled';
import { checkIfFriend, setToast, unblockUser } from '../../Controllers/Controller';
import Link from 'next/link';
import { useChat } from '../../context/ChatContext';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth } from '../../context/AuthContext';
type Props = {
    contact?: TContact;
    from:string;
}
const ContactBox = ({contact,from}:Props) => {
    const {firstName,lastName,photoURL,uid,bio,dob,email,gender,phone} = contact || {}
    const {uid:mUid} = useAuth()
    const {blockedUsers,isBlockedByArr} = useChat()
    const [isFriend,setIsFriend] = React.useState(false)
    const [isBlocked,setIsBlocked] = React.useState(false)
    const [isBlockedBy,setIsBlockedBy] = React.useState(false)
    useEffect(()=> {
        const checkFriend = async ()=> {
            if(uid) {
                const val = await checkIfFriend(uid,mUid)
                if(val) {
                    setIsFriend(true)
                }
            }
        }
       if(uid && mUid) checkFriend()
    },[uid,mUid])
    useEffect(()=> {
        // console.log({blockedUsers,isBlockedByArr})
        if(uid) {
            if(blockedUsers) {
                if(blockedUsers.includes(uid)) {
                    setIsBlocked(true)
                }
            }
            if(isBlockedByArr) {
                if(isBlockedByArr.includes(uid)) {
                    setIsBlockedBy(true)
                }
            }

        }
    },[blockedUsers,uid,isBlockedByArr])

    const unblock = async() => {
        if(uid) {
            await unblockUser(mUid,uid).then(()=>{
                setToast("User Unblocked","success")
                setIsBlocked(false)
            })

        }
    }
  return (
    <Box sx={{display:"flex",flexDirection:"column",gap:"15px"}}>
        <Box sx={{display:'flex',gap:"10px",px:"20px"}}>
       <Avatar src={photoURL} sx={{width:'40px',height:'40px'}}/>
       <Box sx={{display:'flex',alignItems:'center'}}>
        <Typography sx={{fontSize:"18px",color:from==="sender"?"black":"white"}}>
        {firstName} {lastName}
        </Typography>
       
       </Box>
        </Box>
        {
            isBlockedBy? <Button disabled style={{minWidth:"80%",margin:"auto",fontSize:"12px"}} startIcon={<BlockIcon/>}>{firstName} {lastName} has blocked you</Button>:
            isBlocked? <Button sx={{minWidth:"80%", margin:"auto", backgroundColor:"gray", color:"white", borderRadius:"8px",fontSize:"12px",padding:"13px", '&:hover': {backgroundColor:"lightGray"}}} onClick={unblock} startIcon={<BlockIcon/>}>Unblock {firstName} {lastName}?</Button>:
            isFriend? <StyleButton><Link href={{pathname:`/dashboard/${uid}`,query:{fFirstName:firstName,fLastName:lastName,fDp:photoURL,fBio:bio,fDob:dob,fEmail:email,fGender:gender,fPhone:phone}}} passHref style={{textDecoration:"none",color:"white"}}>Message</Link></StyleButton>:
            <StyleButton style={{minWidth:"80%",margin:"auto",fontSize:"12px"}}>Add Friend</StyleButton>
        }
       
    </Box>
    
  )
}

export default ContactBox