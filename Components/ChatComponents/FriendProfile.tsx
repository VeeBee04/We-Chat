import { motion } from 'framer-motion';
import React from 'react'
import { primary } from '../../StyledComponents/Global';
import FProfilePreview from './FProfilePreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
    openFProfile: boolean;
    setOpenFProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const FriendProfile = ({openFProfile,setOpenFProfile}:Props) => {
  return (
    <motion.div 
      style={{width:"100%", backgroundColor:primary,display:"flex",height:"0",flexDirection:"column"}}
      animate={{ minHeight: openFProfile ? "92vh" : "0" }}
      transition={{ duration: 0.4 }}
    >
         {openFProfile && <ArrowBackIcon onClick={()=>setOpenFProfile(false)} sx={{cursor:"pointer",padding:"24px"}}/>}
      {openFProfile &&  <FProfilePreview/>}
    </motion.div>
  )
}

export default FriendProfile