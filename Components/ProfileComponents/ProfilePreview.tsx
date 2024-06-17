import { Avatar, Box, Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import { StyledLabel,StyledText } from '../../StyledComponents/Styled';
import dayjs from 'dayjs';
import { primary } from '../../StyledComponents/Global';
import InfoIcon from '@mui/icons-material/Info';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import Image from 'next/image';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import BlockedUsersList from '../BlockedComponents/BlockedUsersList';
const ProfilePreview = () => {
    const {dp,firstName,lastName,bio,dob,phone,email,gender} = useProfile();
    const router = useRouter()
    const [disabled,setDisabled] = useState(false)
    const [showBlockedUsers,setShowBlockedUsers] = useState(false)
    useEffect(()=> {
        if(location.pathname === '/profile') {
            setDisabled(true)
            
        }
    },[disabled])
    // useEffect(()=> {
    //     console.log(location.pathname)
    // },[location.pathname])
  return (
    <>
    {
!showBlockedUsers ?
    <Box sx={{width:disabled?"50%":'45%',height:'75%',backgroundColor:'white',margin:"auto auto",borderRadius: "39px 39px 5px 5px",position:"relative"}}>
        <Box sx={{clipPath: "polygon(0% 63%, 33% 88%, 100% 51%, 100% 0, 0 0);",width:"100%",backgroundColor: "rgb(63,150,234)",background: "linear-gradient(90deg, rgba(63,150,234,1) 0%, rgba(44,189,229,1) 44%, rgba(19,220,223,1) 100%)",height:"200px",borderRadius:"39px",border:"5px inset #00ffd4",position:"relative"}}>

        <Grid item sx={{width:"100%",padding:"20px",mt:1}}>
                <StyledLabel style={{textAlign:'center',fontSize:"20px",fontWeight:"bolder",width:'fit-content',color:primary}}>{firstName} {lastName}</StyledLabel>
                <StyledLabel style={{textAlign:'center',fontSize:"16px",width:'fit-content',color:primary}}>{email}</StyledLabel>
                <Box mt={1}>
                <Button onClick={()=>setShowBlockedUsers(true)} disabled={disabled} variant="outlined" sx={{marginRight:"5px",lineHeight:"1.5",color:"lightgray",width:"90px",borderRadius:"10px",fontSize:"8px",borderColor:"lightGray",":hover":{borderColor:"lightgray"}}} startIcon={<BlockIcon/>}>Blocked Users</Button>
                <Button disabled={disabled} variant='contained' color={"primary"} sx={{lineHeight:"1.5",width:"90px",borderRadius:"10px",fontSize:"8px"}} startIcon={<EditIcon/>} onClick={()=>router.push('/profile')}>Edit Profile</Button>
                </Box>
            </Grid>
        </Box>
        <Avatar src={dp} sx={{position:'absolute',transform: "translate(-50%, -50%)",left: '65%',top: "25%",width:120,height:120,borderRadius: '50%', border: "4px solid #FFFFFF",boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",backdropFilter: "blur( 6px )"}}/>
        <Grid container spacing={2} sx={{mt:"20px", padding:"20px",pt:0}}>
            
            <Grid item xs={12} sx={{display:'flex',gap:2}}>
                <Avatar><InfoIcon sx={{width:'fit-content'}}/></Avatar>
                <Box>

                <StyledLabel sx={{fontSize:"14px !important"}}>About me</StyledLabel>
                <StyledText style={{fontSize:"16px",margin:0}}>{bio}</StyledText>
                </Box>
            </Grid>
            <Grid container item xs={12} sx={{height:"fit-content"}}>
                <Grid item xs={6} sx={{display:'flex',gap:2}}>
                <Avatar><CakeIcon sx={{width:'fit-content'}}/></Avatar>
                <Box>

                <StyledLabel sx={{fontSize:"14px !important"}}>Wish me on</StyledLabel>
                <StyledText style={{fontSize:"16px",margin:0}}>{dayjs(dob).format('DD MMMM')}</StyledText>
                </Box>
                </Grid>
                <Grid item xs={6} sx={{display:'flex',gap:2}}>
                <Avatar><PhoneIcon sx={{width:'fit-content'}}/></Avatar>
                <Box>

                <StyledLabel sx={{fontSize:"14px !important"}}>Phone</StyledLabel>
                <StyledText style={{fontSize:"16px",margin:0}}>{phone}</StyledText>
                </Box>
                </Grid>
            </Grid>
           {
            gender && <Grid item xs={12} sx={{display:"flex",alignItems:"center",mt:2,justifyContent:"center"}}>
            {/* <StyledLabel sx={{fontSize:"14px !important"}}>Gender</StyledLabel> */}
                <Image src={`/${gender}.png`} width={150} height={150} alt='gender' />
            </Grid>
           } 
        </Grid>
    </Box>
    :
    <BlockedUsersList setShowBlockedUsers={setShowBlockedUsers}/>
    }
    </>
  )
}

export default ProfilePreview