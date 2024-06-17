"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { primary, reciever, sender } from '../StyledComponents/Global';
interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileContext = createContext({
  firstName: "",
  setFirstName: (firstName: string) => {},
  lastName: "",
  setLastName: (lastName: string) => {},
  email: "",
  setEmail: (email: string) => {},
  phone: "",
  setPhone: (phone: string) => {},
  dob: dayjs(),
  setDob: (dob: Dayjs) => {},
  bio: "",
  setBio: (bio: string) => {},
  dp: "",
  setDp: (dp: string) => {},
  lastActive: "",
  setLastActive: (lastActive: string) => {},
  sendercolor: sender,
  setSenderColor: (sendercolor: string) => {},
  recieverColor: reciever,
  setRecieverColor: (recieverColor: string) => {},
  bgType: "Aesthetic",
  setBgType: (bgType: string) => {},
  bgColor: primary,
  setBgColor: (bgColor: string) => {},
  bgImage: "/1.1.png",
  setBgImage: (bgImage: string) => {},
  gender: "",
  setGender: (gender:string)=>{},
  openProfile: false,
  setOpenProfile: (openProfile: boolean) => {},
});

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [dob, setDob] = React.useState<Dayjs>(dayjs());
  const [firstName,setFirstName] = React.useState<string >("");
  const [lastName,setLastName] = React.useState<string >("");
  const [email,setEmail] = React.useState<string >("");
  const [phone,setPhone] = React.useState<string >("");
    const [bio,setBio] = useState('');
    const [dp,setDp] = useState('');
  const [lastActive,setLastActive] = useState<string >("");
  const [sendercolor,setSenderColor] = useState<string>(sender)
  const [recieverColor,setRecieverColor] = useState<string>(reciever)
  const [bgType,setBgType] = useState<string>('Aesthetic')
  const [bgColor,setBgColor] = useState<string>(primary)
  const [bgImage,setBgImage] = useState<string>('/1.1.png')
  const [gender,setGender] = useState('')
  const [openProfile,setOpenProfile] = useState(false)
  return <ProfileContext.Provider value={{firstName,setFirstName,lastName,setLastName,email,setEmail,phone,setPhone,dob,setDob,bio,setBio,dp,setDp,lastActive,setLastActive,sendercolor,setSenderColor,recieverColor,setRecieverColor,bgType,setBgType,bgColor,setBgColor,bgImage,setBgImage,gender,setGender,openProfile,setOpenProfile}}>{children}</ProfileContext.Provider>;

};
