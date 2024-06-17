import { Avatar, Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { label} from '../../StyledComponents/Global'
import { StyledText } from '../../StyledComponents/Styled'
import BlockIcon from '@mui/icons-material/Block';
import ClearIcon from '@mui/icons-material/Clear';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { rejectReq, setToast } from '../../Controllers/Controller';
type Props = {
    req: any
}
const Notification = ({req}:Props) => {
    const [status,setStatus] = useState(false)
    useEffect(()=> {
        console.log({req,status})
    },[req,status])
    const {uid:mUid} = useAuth()
    const {friendsArr,setFriends,setBlockedUsers} = useChat()
    const blockReq = async() => {
        if(mUid) {
            const fBlockRef = doc(db,"blockedUsers",req.uid)
            await getDoc(fBlockRef).then(async(doc)=>{
                if(doc.exists()) {
                    const {isBlockedBy} = doc.data()
                    if(!isBlockedBy.includes(mUid)) {
                        await setDoc(fBlockRef,{isBlockedBy:[...isBlockedBy,mUid]},{merge:true})
                    }

                }
            })
            const blockRef = doc(db,"blockedUsers",mUid)
            await getDoc(blockRef).then(async(doc)=> {
                if(doc.exists()) {
                    const {ids} = doc.data()
                    if(!ids.includes(req.uid)) {

                        await setDoc(blockRef,{ids:[...ids,req.uid]},{merge:true}).then(()=> {
                            setBlockedUsers([...ids,req.uid])
                            setToast("User blocked","error")
                            setStatus(true)
                        })
                    }
                }
                else {
                    await setDoc(blockRef,{ids:[req.uid],user:mUid},{merge:true}).then(()=> {
                        setBlockedUsers([req.id])
                        setToast("User blocked","error")
                        setStatus(true)
                }
                )
                }
            })
            const reqRef = doc(db, "friendRequests", mUid);
            const docSnap = await getDoc(reqRef);
            if(docSnap.exists()) {
                const { requests } = docSnap.data();
                console.log(requests)
                const newRequests = requests.filter(
                    (request: any) => request.uid !== req.uid
                );
                await setDoc(reqRef,{requests:newRequests},{merge:true})
            }
            
        }
    }
    const reject = async() => {
        if(mUid) {
           const sent = await rejectReq(mUid,req.uid)
              if(sent) {
                setToast("Friend Request rejected","error")
                setStatus(true)
              }
              else {
                setToast("Some error occured","error")
              }
        }
    }
    const acceptReq = async() => {
        if(mUid) {
            const friendRef = doc(db,"friends",mUid)
            if(friendsArr.includes(req.uid)) {
                return
            }
            await setDoc(friendRef,{friendsArr:[...friendsArr,req.uid],count:friendsArr.length+1},{merge:true}).then(async()=> {
                setToast("Friend Request accepted","success")
                setFriends([...friendsArr,req.uid])
                setStatus(true)
                const reqRef = doc(db, "friendRequests", mUid);
                const docSnap = await getDoc(reqRef);
                if (docSnap.exists()) {
                    const { requests } = docSnap.data();
                    console.log(requests)
                    const newRequests = requests.filter(
                        (request: any) => request.uid !== req.uid
                    );
                    await setDoc(reqRef,{requests:newRequests},{merge:true})
                }
                else{
                    console.log("no doc")
                }
            })
            const friendRef2 = doc(db,"friends",req.uid)
            const docSnap = await getDoc(friendRef2)
            if(docSnap.exists()) {
                const {friendsArr} = docSnap.data()
                await setDoc(friendRef2,{friendsArr:[...friendsArr,mUid],count:friendsArr.length+1},{merge:true})
                
            }
        }
    }
  return (
    
    !status && <Box sx={{color:`${label}`,width:"100%",display:"flex",alignItems:"center",height:"8vh",cursor:"pointer",borderRadius:"10px",}}>
        <Box sx={{maxWidth:"15%", display:"flex",justifyContent:"center"}} width={"15%"}>

        <Avatar src={req.photoURL}></Avatar>
        </Box>
        <Box maxWidth={"30%"} width={"30%"}>
            <StyledText style={{fontSize:"14px"}}>{req.firstName} {req.lastName}</StyledText>
        </Box>
        
        <Box sx={{display:'flex',maxWidth:"60%",width:"60%",justifyContent:"space-around"}}>
            <Button variant='outlined' sx={{color:"lightgray",width:"80px",borderRadius:"10px",fontSize:"10px",borderColor:"lightGray",":hover":{borderColor:"lightgray"}}} startIcon={<BlockIcon/>} onClick={blockReq}>Block</Button>
            <Button variant= 'outlined' color='error' sx={{width:"80px",borderRadius:"10px",fontSize:"10px"}} startIcon={<ClearIcon/>} onClick={reject}>Reject</Button>
            <Button variant= 'outlined' color='success' sx={{width:"80px",borderRadius:"10px",fontSize:"10px"}} startIcon={<AddReactionIcon/>} onClick={acceptReq} >Accept</Button>

        </Box>

    </Box>
  )
}

export default Notification