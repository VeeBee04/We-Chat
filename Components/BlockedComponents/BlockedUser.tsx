import React, { useEffect, useRef, useState } from 'react'
import { getUser, setToast, unblockUser } from '../../Controllers/Controller'
import { TAuthUser } from '../../Types/user'
import { Avatar, Box, Button } from '@mui/material'
import { label} from '../../StyledComponents/Global'
import { StyledText } from '../../StyledComponents/Styled'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useAuth } from '../../context/AuthContext'
type Props = {
    blockedId:string
}
const BlockedUser = ({blockedId}: Props) => {
    const {uid:mUid} = useAuth()
    const [user,setUser] = useState<TAuthUser|null>(null)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const fetchData = async () => {
            if(blockedId) {
                const data = await getUser(blockedId)
                if(data) {
                   setUser(data)
                }
            }
        }
        fetchData()
    }, [blockedId])
    const handleUnblock = (uid:string,blockedId:string) => {
        unblockUser(uid,blockedId)
        setToast("User Unblocked","success")
        ref.current?.animate([
          // Start with original size and opacity
          { height: '8vh', opacity: 1},
      
          // After 0.3s, change the opacity to 0
          { height: '8vh', opacity: 0, offset: 0.3 },
      
          // After another 0.3s, change the height to 0
          { height: '0vh', opacity: 0},
        ], {
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards',
        })
        
        setTimeout(() => {
          setUser(null)
        }, 600)
      }
      
    return (
        user && <Box ref={ref} sx={{color:`${label}`,marginY:"1px",textDecoration:"none",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",height:"8vh",cursor:"pointer",borderRadius:"10px"}}>
          <Box sx={{display:"flex", alignItems:"center"}}>
            <Box sx={{display:"flex",justifyContent:"start",alignItems:"center",width:"15%",height:"100%", marginRight:"2rem"}}>
              <Avatar src={user.photoURL}/>
            </Box>
            <Box sx={{height:"100%",alignItems:"center",display:"flex",cursor:"pointer"}}>
              <StyledText style={{fontSize:"14px",margin:"0px"}}>{user.firstName} {user.lastName}</StyledText>
            </Box>
          </Box>
          <Box sx={{display:"grid"}}>
            <Button onClick={()=>handleUnblock(mUid,blockedId)} variant= 'outlined' color='success' sx={{width:"90px",borderRadius:"10px",fontSize:"10px"}} startIcon={<SettingsBackupRestoreIcon/>}>Unblock</Button>
          </Box>
        </Box>
      )
}

export default BlockedUser