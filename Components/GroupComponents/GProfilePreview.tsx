import { Avatar, Badge, Box, Input, styled,Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyleButton, StyledLabel, StyledSubTitle, StyledText } from '../../StyledComponents/Styled'
import { FileUploader } from 'react-drag-drop-files'
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import FriendList from './FriendList'
import { getUser, setToast, updateGroup } from '../../Controllers/Controller'
import GroupMembers from './GroupMembers'
import { useChat } from '../../context/ChatContext'
import { getCookie } from 'cookies-next';
import EditIcon from '@mui/icons-material/Edit';
import Compressor from 'compressorjs'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { bucket } from '../../services/firebase.config'
import { v4 } from 'uuid'
import { socket } from '../../socket';
const fileTypes = ["JPG", "PNG"];
const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

const GProfilePreview = () => {
    const [update,setUpdate] = useState(false)
    const {friendsArr,groupId,gName,members,gAdmin,gDp,gCreatedAt,setGDp,setGName,addMembers} = useChat()
    const [newName,setNewName] = useState(gName || '')
    const [newDp,setNewDp] = useState(gDp || '')
    const [newMembers,setNewMembers] = useState<string[]>(members || [])
    const [adminName,setAdminName] = useState("")
    const [unaddedFriendsArr,setUnAddedFriendsArr] = useState<string[]>([])
    const [isAdmin,setIsAdmin] = useState(false)
    const uid = getCookie("uid")
    const [addedFriends,setAddedFriends] = useState<string[]>([])
    const [file, setFile] = useState<null | File>(null);
    
    useEffect(()=> {
        const getAdmin = async()=> {
            if(gAdmin) {
                const res = await getUser(gAdmin)
                if(res) setAdminName(`${res.firstName} ${res.lastName}`)
            }
        }
        getAdmin()
    },[gAdmin])
    useEffect(()=> {
        if(uid===gAdmin) {
            setIsAdmin(true)
        }
        if(friendsArr) {
            const arr = friendsArr.filter((friend)=> !members.includes(friend))
            setUnAddedFriendsArr(arr)
            // const added = friendsArr.filter((friend)=> members.includes(friend))
            // setAddedFriends(added)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[members])
    const handleChange = (file: File) => {
        console.log(file)
        if(!file) return
        if(file.size>10000000) {
          setToast("File size should be less than 10MB","error")
          return
        }
       // eslint-disable-next-line no-unused-vars
       const compressor =  new Compressor(file,
          {
            quality:0.6,
            success(result) {
              const compressedFile = new File([result], file.name, { type: result.type });
          setFile(compressedFile);
            },
          })
      };
    useEffect(() => {
        async function upload() {
          if (file) {
            const storageRef = ref(bucket, `Imgs/${v4()}`);
            await uploadBytes(storageRef, file).then((data) => {
              console.log(data);
              getDownloadURL(data.ref).then((url) => {
                setNewDp(url);
              });
            });
          }
        }
        upload();
      }, [file, setNewDp]);

    const handleUpdate = async()=> {
        
        await updateGroup(groupId,newName || '',newDp || '',addedFriends).then(()=> {
            if(socket.connected) {
                socket.emit("updateGroup",{groupId,newName,newDp,newMembers:[...members,...addedFriends]})
            }
            console.log(addedFriends)
            setGName(newName)
            setGDp(newDp)
            addMembers((prev)=> [...prev,...addedFriends])
            setNewMembers((prev)=> [...prev,...addedFriends])
            setToast("Group updated successfully","success")
            setUpdate(false)


        }
        ).catch((err)=> {
            console.log(err)
            setToast("unexpected error occured","error")
        }
        )
    }
    const handleCancelUpdate = ()=> {
      setUpdate(false)
    }
    // useEffect(()=> {
    //     console.log(members)
    // },[members])
    useEffect(()=> {
      console.log({gName,gDp,members})
    },[gName,gDp,members])
    useEffect(()=> {
      if(socket.connected) {
        socket.on('group_updated',(data)=> {
          const {newName,newDp,id,newMembers} = data
          console.log("chalgya")
          if(id === groupId) {
            console.log("updated group")
            setGName(newName)
            setGDp(newDp)
            addMembers(newMembers)
          }
        })
        socket.on('member_removed',(data)=> {
          const {newMembers} = data
          setNewMembers(newMembers)
          addMembers(newMembers)
        })
      }

      return ()=> {
        socket.off('group_updated')
        socket.off('member_removed')
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <>
    <Box sx={{maxWidth:"90%",margin:"auto",display:'flex',flexDirection:"column",width:"90%",gap:"40px",justifyContent:"center"}}>
        {/* <StyledSubTitle>{gName}</StyledSubTitle> */}
        <Box sx={{display:"flex",gap:"50px",alignItems:"center"}}>
       { update? <FileUploader
                
                 handleChange={handleChange}
                 name="file"
                 types={fileTypes}
                 // eslint-disable-next-line react/no-children-prop
                 children={
                   <Badge
                     overlap="circular"
                     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                     badgeContent={
                       <SmallAvatar>
                         <CameraEnhanceIcon
                           sx={{
                             backgroundColor: "white",
                             cursor: "pointer",
                             color: "green",
                           }}
                         />
                       </SmallAvatar>
                     }
                   >
                     <Avatar
                       alt="Travis Howard"
                       src={newDp || ''}
                       sx={{ width: 100, height: 100, margin: "auto" }}
                     />
                   </Badge>
                 }
               />:
                     <Avatar
                       alt="Travis Howard"
                       src={newDp || ''}
                       sx={{ width: 100, height: 100}}
                     />
               }
               <Box>
               {
                !update? <Box sx={{display:"flex",alignItems:"center",gap:"20px"}}>
                        <StyledSubTitle >{gName}</StyledSubTitle>
                        {isAdmin && <Button color="secondary" variant="outlined" style={{width:"7%"}} onClick={()=>setUpdate(true)}><EditIcon/></Button>}
                        </Box>: <Input
                id="name"
                aria-describedby="my-helper-text"
                required
                sx={{maxWidth:"200px",width:"200px"}}
                defaultValue={gName || ''}
                onChange={(event) => setNewName(event.target.value)}
                
              />
               } 
                <StyledText style={{margin:0}}>Created by {adminName} at: {gCreatedAt}</StyledText>
               
        </Box>
              </Box>
        </Box>
        <Box sx={{width:"80%",margin:"auto"}}>
        {update?<StyledLabel htmlFor="firstName">Add Members</StyledLabel>:<StyledLabel htmlFor="firstName">Members</StyledLabel>}
        <Box sx={{maxWidth:"100%",width:"100%",height:"30vh",overflow:"auto"}}>

        {
            !update? newMembers && newMembers.map((friend,index)=> {
                return <GroupMembers key={friend} friendId={friend} addNewMembers={setNewMembers} newMembers={newMembers} groupId={groupId} isAdmin={isAdmin}/>
            })
            :
    unaddedFriendsArr && unaddedFriendsArr.map((friend,index)=> {
        return <FriendList key={friend} friendId={friend} addNewMembers={setAddedFriends}/>
    })
        }
        </Box>
        {update&& <Box sx={{display:"flex",gap:"20px"}}>
          <StyleButton style={{width:"25%"}} onClick={handleUpdate}>Update Group</StyleButton>
          <Button color='error' variant='outlined' onClick={handleCancelUpdate}>Cancel</Button>
        </Box>}
        </Box>
    </>
  )
}

export default GProfilePreview