import { Box, Typography,Avatar,Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../Controllers/Controller'

type Props = {
    friendId: string,
    addNewMembers : React.Dispatch<React.SetStateAction<string[]>>,
}
const FriendList = ({friendId,addNewMembers}:Props) => {
    const [fFirstName,setFFirstName] = useState("")
    const [fLastName,setFLastName] = useState("")
    const [fDp,setFDp] = useState("")
    const [checked, setChecked] = useState(false);
    useEffect(()=> {
        const fetchFriendDetails = async()=> {
            if(friendId) {
                const res = await getUser(friendId)
                if(res) {
                    const {firstName,lastName,photoURL} = res
                    setFFirstName(firstName)
                    setFLastName(lastName)
                    setFDp(photoURL)
                }
            }
        }
        fetchFriendDetails()
    },[friendId])

    const handleChecked = ()=> {
        setChecked(!checked)
        if(checked) {
            addNewMembers((prev)=> prev.filter((id)=> id!==friendId))
        }
        else {
            addNewMembers((prev)=> [...prev,friendId])
        }
    }
  return (
   <>
    <Box sx={{width:"60%",height:"40px",borderRadius:"10px",border:"1px solid gray",my:2,p:1,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Box sx={{display:"flex",alignItems:"center"}}>
        <Avatar src={fDp} alt='friend' sx={{mr:3}}/>
        <Typography>{fFirstName} {fLastName}</Typography>
        </Box>
        <Checkbox color="secondary" checked={checked} onChange={handleChecked}/>
    </Box>
   </>
  )
}

export default FriendList