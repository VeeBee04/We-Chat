import { Badge, Box } from '@mui/material'
import React from 'react'
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { primary } from '../../StyledComponents/Global';
type Props = {
    streamRef:React.MutableRefObject<HTMLVideoElement|null>,
    muteMic?:boolean,
    muteVid?:boolean,
    }
const StreamBox = ({streamRef,muteMic,muteVid}:Props) => {
  return (
   <>

   <Box sx={{maxWidth:"90%",height:"35vh",borderRadius:"24px"}}>
    <video ref={streamRef} autoPlay playsInline muted style={{transform:"scaleX(-1)",width:"inherit",height:"inherit",borderRadius:"24px"}}/>
 {
    muteMic && <Badge
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
   
  >
  <MicOffIcon sx={{color:primary}}/>
  </Badge>
 }   
{
    muteVid &&  <Badge
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
   
  >
  <VideocamOffIcon sx={{color:primary}}/>
  </Badge>
}
   
    </Box>
   </>
  )
}

export default StreamBox