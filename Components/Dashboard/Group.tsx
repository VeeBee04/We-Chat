import { Avatar, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledText } from '../../StyledComponents/Styled'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from 'next/link';
import { label, primary } from '../../StyledComponents/Global';
import { fetchGroupDetails } from '../../Controllers/Controller';
import { socket } from '../../socket';

type Props = {
  groupId:string
}
const Group = ({groupId}:Props) => {
  const [gName,setGName] = useState("")
  const [gDp,setGDp] = useState("")
  const [gAdmin,setGAdmin] = useState("")
  const [gCreatedAt,setGCreatedAt] = useState("")

  useEffect(()=> {
    const groupDetails = async()=> {

        if(groupId) {
          const res = await fetchGroupDetails(groupId)
          if(res) {
            const {admin,createdAt,groupDp,name} = res
            setGName(name)
            setGDp(groupDp)
            setGAdmin(admin)
            setGCreatedAt(createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
            
          }
        }
    }
    groupDetails()
  },[groupId])
    useEffect(()=> {
    if(socket.connected) {
      socket.on('group_list_updated',(data)=> {
        const {newName,newDp,id} = data
        console.log("chalgya")
        if(id === groupId) {
          console.log("updated group")
          setGName(newName)
          setGDp(newDp)

        }
      })
    }
    return ()=> {
      socket.off('group_list_updated')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Box component={Link} href={{pathname:`/dashboard/groups/${groupId}`,query:{gName,gAdmin,gCreatedAt,gDp}}} passHref sx={{color:`${label}`,textDecoration:"none",width:"100%",display:"flex",zIndex:3,alignItems:"center",height:"8vh",cursor:"pointer",borderRadius:"10px",'&:hover': { backgroundColor: `${primary}`,transition:"all 0.2s" }}}>

    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"15%",height:"100%"}}>

  <Avatar src={gDp}/>
    </Box>
  <Box sx={{width:"75%",height:"100%",alignItems:"center",display:"flex",cursor:"pointer"}}>
    <StyledText style={{fontSize:"14px",margin:"0px"}}>{gName}</StyledText>
  </Box>
  <Box sx={{width:"10px",height:"100%",display:"flex",alignItems:"center",cursor:"pointer"}}>
    <KeyboardDoubleArrowRightIcon/>
  </Box>
    </Box>
  )
}

export default Group