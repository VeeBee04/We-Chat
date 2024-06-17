import { Avatar, Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getUser, leaveGroup, removeMember, setToast } from '../../Controllers/Controller'
import { getCookie } from 'cookies-next'
import { useChat } from '../../context/ChatContext'
import { useRouter } from 'next/navigation'
import { socket } from '../../socket'
type Props = {
    friendId: string,
    groupId: string
    addNewMembers: React.Dispatch<React.SetStateAction<string[]>>,
    isAdmin:boolean,
    newMembers:string[]

}
const GroupMembers = ({groupId,friendId,addNewMembers,isAdmin,newMembers}:Props) => {
    const router = useRouter()
    const [fFirstName,setFFirstName] = useState("")
    const [fLastName,setFLastName] = useState("")
    const [fDp,setFDp] = useState("")
    const uid = getCookie("uid")
    const {members,setAdmin,addMembers,setGDp,setGName,setCreatedAt} = useChat()
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
    const handleRemove = async()=>{
        await removeMember(groupId,friendId).then(()=>{
            addNewMembers((prev)=> prev.filter((id)=> id!==friendId))
            setToast("Member removed successfully","success")
            if(socket.connected) {
                socket.emit("removeMember",{groupId,removedMemberId:friendId,newMembers})
            }
        }).catch((err)=> {
            console.log(err)
            setToast("unexpected error occured","error")
        }
        )
    }
    const handleLeave = async()=> {
        if(isAdmin) {
            const newAdmin = members.filter((id)=> id!==friendId)[0]
            console.log(newAdmin)
            await leaveGroup(groupId,friendId,newAdmin).then(()=> {
                setToast("Group left successfully","success")
                addMembers([])
                setAdmin('')
                setGDp('')
                setGName('')
                setCreatedAt('')
                router.push("/dashboard")
            
            }).catch((err)=> {
                console.log(err)
                setToast("unexpected error occured","error")
            }
            )
        }
        else {
            await leaveGroup(groupId,friendId,"").then(()=> {
                setToast("Group left successfully","success")
                addMembers([])
                setAdmin('')
                setGDp('')
                setGName('')
                setCreatedAt('')
                router.push("/dashboard")
            
            }).catch((err)=> {
                console.log(err)
                setToast("unexpected error occured","error")
            }
            )
        }
    }
  return (
    <>
     <Box sx={{width:"60%",height:"40px",borderRadius:"10px",border:"1px solid gray",my:2,p:1,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Box sx={{display:"flex",alignItems:"center", width:"100%",justifyContent:"space-between"}}>
            <Box sx={{display:"flex",alignItems:"center"}}>
        <Avatar src={fDp} alt='friend' sx={{mr:3}}/>
        <Typography>{fFirstName} {fLastName}</Typography>
            </Box>
        {friendId!==uid?<Button color='error' variant='outlined' sx={{display: isAdmin?"block":"none"}} onClick={handleRemove}>Remove</Button>:
        <Button color='error' variant='contained' onClick={handleLeave}>Leave Group</Button> }
        </Box>
    </Box>
    </>
  )
}

export default GroupMembers