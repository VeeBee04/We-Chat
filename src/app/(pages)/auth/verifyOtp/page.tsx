"use client";
import React from 'react'
import { StyledGrid } from '../../../../../StyledComponents/Styled'
import { Grid } from '@mui/material'
import ImgCarousel from '../../../../../Components/LoginComponents/ImgCarousel'
import OtpPage from '../../../../../Components/LoginComponents/OtpPage';

const VerifyOTP = () => {
  return (
    <>
     <Grid container>
  <Grid item xs={4} >
    <OtpPage/>
  </Grid>
  <StyledGrid item xs={8}>
    <ImgCarousel/>
  </StyledGrid>
</Grid>
    </>
  )
}

export default VerifyOTP
