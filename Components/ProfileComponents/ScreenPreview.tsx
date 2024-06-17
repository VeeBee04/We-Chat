import { Box } from '@mui/material'
import React from 'react'

const ScreenPreview = () => {
  return (
    <>
    <Box sx={{clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 90%, 50% 75%, 0% 75%)",width:100,height:100,backgroundColor:"red"}}>
      </Box>
    </>
  )
}

export default ScreenPreview