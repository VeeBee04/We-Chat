
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicProfile from './BasicProfile';
import PictureUpload from './PictureUpload';
import ScreenCustomization from './ScreenCustomization';
import Link from 'next/link';
import { StyleButton } from '../../StyledComponents/Styled';
type Props = {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    steps: string[];

}
const ProfileStepper = ({activeStep,setActiveStep,steps}:Props) => {
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };
  return (
    <Box sx={{ width: '80%' ,margin:"auto"}}>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
    {activeStep === steps.length ? (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>
          All steps completed - you&apos;re finished
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <StyleButton style={{fontSize:"14px"}}><Link href={'/dashboard'} style={{textDecoration: "none",color: "white"}}>Move to Dashboard</Link></StyleButton>
        </Box>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Box>

           {activeStep+1===1?<BasicProfile handleNext={handleNext} handleBack = {handleBack} handleReset={handleReset} activeStep={activeStep} steps={steps}/>:activeStep+1===2?<PictureUpload handleNext={handleNext} handleBack = {handleBack} handleReset={handleReset} activeStep={activeStep} steps={steps}/>:<ScreenCustomization handleBack = {handleBack} handleNext={handleNext} handleReset={handleReset} activeStep={activeStep} steps={steps}/>}
        </Box>
       
       
      </React.Fragment>
    )}
  </Box>

  )
}

export default ProfileStepper