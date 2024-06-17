import React, { useEffect } from 'react'
import StepperBtn from './StepperBtn'
import { FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { TwitterPicker } from 'react-color';
import { reciever, primary } from '../../StyledComponents/Global';
import { StyledLabel } from '../../StyledComponents/Styled';
import Box from '@mui/material/Box';
import BlockPickers from './BlockPickers';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { useProfile } from '../../context/ProfileContext';

type Props = {
    handleNext: () => void;
    handleBack: () => void;
    handleReset: () => void;
    activeStep: number;
    steps: string[];
  };
  const senderColors = ['#D9E3F0', '#F47373', '#697689', '#fbc0d6', '#2CCCE4', '#eff5f6', '#dce775', '#ff8a65', '#dedbee','#f6d6a4']
  const recieverColors = ['#462867', '#37D67A', '#bd412f', '#5b4944', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8',reciever]
  const bgs = ['1.1.png','1.2.png','2.1.png','2.2.png']
  const bgColors = [primary,'#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7']
const ScreenCustomization = ({
    handleNext,
    handleBack,
    handleReset,
    activeStep,
    steps,
  }: Props) => {
    const {sendercolor,setSenderColor,recieverColor,setRecieverColor,bgType,setBgType,bgColor,setBgColor,bgImage,setBgImage} = useProfile()
    const {uid} = useAuth();
    useEffect(() => {
      const docRef = doc(db,"backgrounds",uid)
      getDoc(docRef).then((doc) => {
        if(doc.exists()){
          const data = doc.data();
          if(data){
            setSenderColor(data.sendercolor)
            setRecieverColor(data.recieverColor)
            setBgType(data.bgType)
            if(data.bgType==='Aesthetic'){
              setBgImage(data.bgImage)
            }
            else {
              setBgColor(data.bgColor)
            }
          }
        }
      }
      )
    }
    ,[setBgColor, setBgImage, setBgType, setRecieverColor, setSenderColor, uid])
    const handleChange = (event: SelectChangeEvent) => {

      setBgType(event.target.value as string);
      
    };
    const handleSubmit = () => {
      console.log({sendercolor,recieverColor,bgType,bgColor,bgImage})
      const docRef = doc(db,"backgrounds",uid)
      if(bgType==='Aesthetic'){
        setDoc(docRef,{sendercolor,recieverColor,bgType,bgImage},{merge:true})
      }
      else {
        setDoc(docRef,{sendercolor,recieverColor,bgType,bgColor},{merge:true})
      }
        handleNext();
      }

  return (
    <>
    <Grid sx={{display:'flex', pt:5}} spacing={3}>
        <BlockPickers color={sendercolor} setColor={setSenderColor} Colors={senderColors} type={'Sender'}/>
        <BlockPickers color={recieverColor} setColor={setRecieverColor} Colors={recieverColors} type={'Reciever'}/>
    </Grid>
    <Grid xs={12} pt={5}>
    <FormControl sx={{width:"50%",pb:3}}>
  <StyledLabel id="demo-simple-select-label" sx={{pb:2}}>Select Chat Background</StyledLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={bgType}
    label="Select Type of Background"
    onChange={handleChange}
  >
    <MenuItem value={'Aesthetic'}>Aesthetic</MenuItem>
    <MenuItem value={'Solid'}>Solid</MenuItem>
  </Select>
</FormControl>
    <Box sx={{display:'flex', justifyContent:'flex-start'}}>

    {
      bgType==='Aesthetic'?bgs.map((bg,index) => (
        <div style={{width:80, height:50, borderRadius:20, background:`url(/${bg})`,marginRight:30,cursor:"pointer"}} onClick={()=>setBgImage(bg)}  key={index}></div>
      )):<TwitterPicker width='80%' triangle='hide' color={bgColor} colors={bgColors} onChangeComplete={(color)=>setBgColor(color.hex)} />

    }
    </Box>
    </Grid>
    <StepperBtn
    handleSubmit={handleSubmit}
    handleBack={handleBack}
    activeStep={activeStep}
    steps={steps}/>
    </>
  )
}

export default ScreenCustomization