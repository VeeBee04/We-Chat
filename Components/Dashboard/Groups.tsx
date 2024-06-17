import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { StyledText } from '../../StyledComponents/Styled'
import { fetchGroups } from '../../Controllers/Controller';
import { useChat } from '../../context/ChatContext';
import AddIcon from '@mui/icons-material/Add';
import Group from './Group';
import { useProfile } from '../../context/ProfileContext';
const Groups = () => {
  const {groups,setGroups,setCreateGroup} = useChat()
  const {openProfile,setOpenProfile} = useProfile()
  useEffect(()=> {
    const getGroups = async() => {
    if(groups.length===0) {
      const uid = localStorage.getItem("uid")
      if(uid) {

        const res = await fetchGroups(uid)
        if(res) {
          setGroups(res)
        }
      }
    }
    }
    getGroups()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const handleOpenGroup = ()=> {
    openProfile && setOpenProfile(false)
    setCreateGroup(true)
  }
  
  return (
   <>
   <Box>
   <Button variant="outlined" color='secondary' startIcon={<AddIcon />} onClick={handleOpenGroup}>
  Create a new Group
</Button>
   </Box>
       {groups.length!==0?
      <Box sx={{width:"100%",height:"max-content",display:"flex",my:1,alignItems:"center",flexDirection:"column",gap:"10px",}}>
      {groups && groups.map((group:string,index:number)=>
      
      <Group key={group} groupId={group}/>
      )}
      
     
  </Box>
 :
  <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",maxHeight:"70vh",height:"65vh"}}>
     <StyledText style={{textAlign:"center",color:"gray"}}>You have not joined a group yet . Time to search for new groups! 🌟</StyledText>
   </Box> }
   </>
  )
}

export default Groups