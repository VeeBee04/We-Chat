import { Box } from '@mui/material'
import React from 'react'
import { StyledText } from '../../StyledComponents/Styled'
import Call from './Call';
type Props = {
  friendsArr:string[]
}
const Calls = ({friendsArr}:Props) => {
  // useEffect(()=> {
  //   console.log(friendsArr)
  // },[friendsArr])
  return (
    <>
    {friendsArr.length!==0?
      <Box sx={{width:"100%",height:"max-content",display:"flex",my:1,alignItems:"center",flexDirection:"column",gap:"10px",}}>
      {friendsArr && friendsArr.map((friend:string,index:number)=>
      
      <Call key={friend} friendId={friend}/>
      )}
      
     
  </Box>
 :
  <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",maxHeight:"70vh",height:"65vh"}}>
     <StyledText style={{textAlign:"center",color:"gray"}}>Your friend list seems a bit lonely. Time to search for new connections! 🌟</StyledText>
   </Box> }
    
    </>
 
  )
}

export default Calls