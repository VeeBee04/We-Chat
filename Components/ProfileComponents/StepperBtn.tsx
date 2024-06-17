import { Box, Button } from '@mui/material'
import React from 'react'
import { StyleButton } from '../../StyledComponents/Styled';

type Props = {
    handleBack: () => void;
    handleSubmit: () => void;
    activeStep: number;
    steps: string[];
    
}
const StepperBtn = ({handleBack,handleSubmit,activeStep,steps}:Props) => {
  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 5 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <StyleButton onClick={handleSubmit} style={{fontSize:14}}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </StyleButton>
        </Box>
    </>
  )
}

export default StepperBtn