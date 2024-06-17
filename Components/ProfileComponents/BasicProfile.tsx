"use client";
import React,{useEffect} from "react";
import { StyledLabel, StyledSubTitle } from "../../StyledComponents/Styled";
import {  FormControlLabel, Grid, Input, Radio, RadioGroup, } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import StepperBtn from "./StepperBtn";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase.config";
import dayjs from "dayjs";
import { PhoneNumberUtil } from 'google-libphonenumber';
import { MuiPhone } from '../LoginComponents/MuiPhone';
import { capitalizeFirstLetter, isPhoneValid, setToast } from "../../Controllers/Controller";
const phoneUtil = PhoneNumberUtil.getInstance();
type Props = {
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  activeStep: number;
  steps: string[];
}
const BasicProfile = ({handleNext,handleBack,handleReset,activeStep,steps}:Props) => {
  const {firstName,setFirstName,lastName,setLastName,email,setEmail,phone,setPhone,dob,setDob,gender,setGender} = useProfile();
  const [muiPhone, setMuiPhone] = React.useState('');
  useEffect(()=> {
    if(phone) {

      const number = phoneUtil.parseAndKeepRawInput(phone)
      console.log(number.getCountryCode());
      setMuiPhone(phoneUtil.format(number, 0))
    }
  },[phone])
  const {uid} = useAuth();
  const handleSubmit = () => {
    if(!isPhoneValid(muiPhone)) {
      setToast("Invalid Phone Number","error")
      
    }
    else if(firstName === '') {
      setToast("First Name is required","error")
    }
    else {

      const docRef = doc(db, "user", uid);
      setPhone(muiPhone)
      const cFirstName = capitalizeFirstLetter(firstName)
      const cLastName = capitalizeFirstLetter(lastName)
      setDoc(docRef, { email,firstName:cFirstName,lastName:cLastName,phone:muiPhone,dob: dob?.format("YYYY-MM-DD"),gender,timestamp: serverTimestamp() }, { merge: true });
      console.log(firstName,lastName,email,phone,dob?.format("YYYY-MM-DD"))
      handleNext();
    }
  }
  return (
    <>
      <StyledSubTitle>Basic Profile</StyledSubTitle>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={6}>
            
              <StyledLabel htmlFor="firstName">First Name</StyledLabel>
              <Input
                id="firstName"
                aria-describedby="my-helper-text"
                required
                defaultValue={firstName || ''}
                style={{minWidth:"80%"}}
                onChange={(event) => setFirstName(event.target.value)}
                
              />
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={6}>
            
              <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
              <Input
                id="lastName"
                aria-describedby="my-helper-text"
                defaultValue={lastName || ''}
                style={{minWidth:"80%"}}
                onChange={(event) => setLastName(event.target.value)}
              />
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={6}>
            
              <StyledLabel htmlFor="email">Email</StyledLabel>
              <Input
                id="email"
                aria-describedby="my-helper-text"
                defaultValue={email || ''}
                style={{minWidth:"80%"}}
                type="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={6}>
            
              {/* <StyledLabel htmlFor="phone">Phone</StyledLabel>
              <Input
                id="phone"
                aria-describedby="my-helper-text"
                required
                type="number"
                style={{minWidth:"80%"}}
                defaultValue={phone}
                onChange={(event) => setPhone(event.target.value)}
              /> */}
              <MuiPhone value={muiPhone} onChange={(muiPhone)=>setMuiPhone(muiPhone)} style={{minWidth:"250px"}}/>
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={6}>
            
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <DatePicker
                    label="DOB"
                    value={dayjs(dob)}
                    onChange={(newValue) => newValue && setDob(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={6}>
  <StyledLabel >Gender</StyledLabel>
  <RadioGroup
    // eslint-disable-next-line no-unneeded-ternary
    value={gender}
    name="radio-buttons-group"
    onChange={(event) => setGender(event.target.value)}
  >
    <FormControlLabel value="M" control={<Radio />} label="Male" />
    <FormControlLabel value="F" control={<Radio />} label="Female" />
  </RadioGroup>
          </Grid>
        </Grid>
   <StepperBtn handleSubmit={handleSubmit} handleBack={handleBack} activeStep={activeStep} steps={steps}/> 
      </form>
    </>
  );
};

export default BasicProfile;
