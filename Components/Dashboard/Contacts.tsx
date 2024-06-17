"use client";
import {Box } from '@mui/material'
import React from 'react'
import Contact from './Contact';
import { StyledText } from '../../StyledComponents/Styled';

type Props = {
  friendsArr: string[],
}
const Contacts = ({friendsArr}:Props) => {



  return (
    <>
   
    {friendsArr.length!==0?
      <Box sx={{width:"100%",height:"max-content",display:"flex",my:1,alignItems:"center",flexDirection:"column",gap:"10px",}}>
      {friendsArr && friendsArr.map((friend:string,index:number)=>
      
      <Contact key={friend} friendId={friend}/>
      )}
      
     
  </Box>
 :
  <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",maxHeight:"70vh",height:"65vh"}}>
     <StyledText style={{textAlign:"center",color:"gray"}}>Your friend list seems a bit lonely. Time to search for new connections! 🌟</StyledText>
   </Box> }
 
    </>
  )
}

export default Contacts