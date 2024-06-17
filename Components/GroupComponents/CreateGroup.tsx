import React, { useEffect, useState } from 'react'
import { StyleButton, StyledLabel, StyledSubTitle } from '../../StyledComponents/Styled'
import { Avatar, Box, styled, Badge, Input, Button } from '@mui/material'
import { FileUploader } from 'react-drag-drop-files'
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import { setToast } from '../../Controllers/Controller'
import Compressor from 'compressorjs'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { bucket, db } from '../../services/firebase.config'
import { v4 } from 'uuid'
import { useChat } from '../../context/ChatContext';
import FriendList from './FriendList';
import {  addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
const fileTypes = ["JPG", "PNG"];
const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
const CreateGroup = () => {
    const [name,setName] = useState("")
    const [dp,setDp] = useState("")
    const {friendsArr,setGroups,groups,setCreateGroup} = useChat()
    const {uid} = useAuth()
    const [file, setFile] = useState<null | File>(null);
    const [bucketUrl,setBucketUrl] = useState<string>("")
    // eslint-disable-next-line no-unused-vars
    const [members,addMembers] = useState<string[]>([])
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
            const generateUrl = `Imgs/${v4()}`
            const storageRef = ref(bucket, generateUrl);
            await uploadBytes(storageRef, file).then((data) => {
              console.log(data);
              getDownloadURL(data.ref).then((url) => {
                setDp(url);
                setBucketUrl(generateUrl)
              });
            });
          }
        }
        upload();
      }, [file, setDp]);
    //   useEffect(()=> {
    //     console.log(members)
    //   },[members])
    const handleCreate = async()=> {
        if(name === "") {
            setToast("Group Name is required","error")
            return
        }
        if(members.length === 0) {
            setToast("Add Members to the group","error")
            return
        }
        const grpRef = collection(db,"groups")
        const res = await addDoc(grpRef,{name,dp,members:[...members,uid],admin:uid,createdAt:serverTimestamp()})
        if(res) {
            setToast("Group Created","success")
            setGroups((prev)=> [...prev,res.id])
            setCreateGroup(false)
            const users = [...members,uid]
            users.forEach(async(user)=> {
                const userRef = doc(db,"user",user)
                // eslint-disable-next-line no-unused-vars
                const userSnap = setDoc(userRef,{groups:[...groups,res.id]},{merge:true}).then(()=> {
                  console.log("Group added to user")
              })
            }
            )
            // const userRef = doc(db,"user",uid)
            // // eslint-disable-next-line no-unused-vars
            // const userSnap = setDoc(userRef,{groups:[...groups,res.id]},{merge:true}).then(()=> {
            //     console.log("Group added to user")
            // })
        }
        else {
            setToast("Something went wrong","error")
        }
    }
    const handleCancel = ()=> {
      setName("")
      addMembers([])
      if(dp!=="") {
        const storageRef = ref(bucket,bucketUrl);
        deleteObject(storageRef).then(()=> {
          setDp("")
          setBucketUrl("")
        }
      ).catch((error)=> {
          console.log(error)
          })
      }
      setCreateGroup(false)
    }
      return (
        <>
        <Box sx={{maxWidth:"90%",margin:"auto",display:'flex',flexDirection:"column",width:"90%",gap:"40px",justifyContent:"center",zIndex:2}}>
        <StyledSubTitle>Create a new Group</StyledSubTitle>
        <Box sx={{display:"flex",gap:"50px",alignItems:"center"}}>
        <FileUploader
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
                       src={dp}
                       sx={{ width: 100, height: 100, margin: "auto" }}
                     />
                   </Badge>
                 }
               />
               <Box sx={{maxWidth:"300px", width:"300px"}}>
                <StyledLabel htmlFor="firstName">Group Name</StyledLabel>
              <Input
                id="name"
                aria-describedby="my-helper-text"
                required
                sx={{maxWidth:"200px",width:"200px"}}
                defaultValue={name || ''}
                onChange={(event) => setName(event.target.value)}
                
              />
              </Box>
        </Box>
        <Box>
        <StyledLabel htmlFor="firstName">Add Members</StyledLabel>
        <Box sx={{maxWidth:"100%",width:"100%",height:"30vh",overflow:"auto"}}>

        {
            friendsArr && friendsArr.map((friend,index)=> {
                return <FriendList key={friend} friendId={friend} addNewMembers={addMembers}/>
            })
        }
        </Box>
        </Box>
        <Box sx={{display:"flex",gap:"20px"}}>
        <StyleButton style={{width:"25%"}} onClick={handleCreate}>Create Group</StyleButton>
        <Button variant='outlined' color='error' onClick={handleCancel}>Cancel</Button>
        </Box>
        </Box>
        </>
       )
}

export default CreateGroup