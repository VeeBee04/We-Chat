"use client";
import React, { useEffect } from 'react'
import { useProfile } from '../../../../../../context/ProfileContext';

import {motion} from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import ProfilePreview from '../../../../../../Components/ProfileComponents/ProfilePreview';
import IncomingCall from '../../../../../../Components/CallComponents/IncomingCall';
import { useCall } from '../../../../../../context/CallContext';
import { socket } from '../../../../../../socket';
import { useChat } from '../../../../../../context/ChatContext';
import GChatScreen from '../../../../../../Components/GroupComponents/GChatScreen';
import CreateGroup from '../../../../../../Components/GroupComponents/CreateGroup';
type GroupPageProps = {
  params: {
    groupId: string; // or number, or whatever type recId should be
  };
};
const GroupPage = ({params}:GroupPageProps) => {
  const {groupId} = params
  const {openProfile,setOpenProfile} = useProfile()
  const {incomingCall} = useCall()
  const {setGroupId,createGroup} = useChat()
  const variants = {
    open: {opacity:1,width:"100%"},
    closed: {opacity:0,width:"0%"}
  }
  useEffect(()=> {
    setOpenProfile(false)
  
  },[groupId, setOpenProfile])
  useEffect(() => {
    console.log(params.groupId)
    if (params.groupId && socket.connected) {
        // console.log("chala")
      socket.emit("joinGroup", {groupId: params.groupId});
    }
  }, [params]);
  useEffect(()=> {
    setGroupId(groupId)
  },[groupId,setGroupId])  
//   useEffect(()=> {
//     if(socket.connected) {
//       socket.on('group_updated',(data)=> {
//         const {newName,newDp,newMembers} = data
//         console.log("updated group")
//         setGName(newName)
//         setGDp(newDp)
//         addMembers(newMembers)
//       })
//     }
//   },[])
  return (
    <>
   {
    !openProfile && !createGroup && <GChatScreen groupId={groupId}/>
   } 
    {
      createGroup && <CreateGroup/>
    }
    <motion.div style={{height:"100%",display:"flex",flexDirection:"column"}}
    initial="closed"
    animate={openProfile?"open":"closed"}
    variants={variants}
    transition={{
      opacity:{delay:openProfile?0:0.3},
      width:{duration:0.3}
    }}>
      <Box sx={{padding:"24px",height:"100%",display:openProfile?"flex":"none"}}>

      <CloseIcon sx={{cursor:"pointer"}} onClick={()=>setOpenProfile(false)}></CloseIcon>
      <ProfilePreview/>
      </Box>
    </motion.div>
    
{incomingCall && <IncomingCall/>}
    </>
  )
}

export default GroupPage