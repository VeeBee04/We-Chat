import React, { useEffect, useState } from 'react'
import { getUser, sendContact, setToast } from '../../Controllers/Controller'
import { Avatar, Box } from '@mui/material'
import { StyledText } from '../../StyledComponents/Styled'
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { label } from '../../StyledComponents/Global';
import { TChatType, TContact } from '../../Types/user';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { socket } from '../../socket';

type Props = {
    setType:React.Dispatch<React.SetStateAction<string>>;
    docRef:any|null;
    uid:string;
    setMessages:React.Dispatch<React.SetStateAction<TChatType[]|null>>;
    friendId:string;
    setDocRef:React.Dispatch<React.SetStateAction<any|null>>;
    chatId:string;
    refer:React.RefObject<HTMLDivElement>;
}
const SearchedContact = ({friendId,docRef,setDocRef,setMessages,setType,uid,chatId,refer}:Props) => {
    const [fFirstName,setFFirstName] = useState("")
  const [fLastName,setFLastName] = useState("")
  const [fDp,setFDp] = useState("")
  const [fBio,setFBio] = useState("")
  const [fDob,setFDob] = useState("")
  const [fEmail,setFEmail] = useState("")
  const [fGender,setFGender] = useState("")
  const [fPhone,setFPhone] = useState("")
    useEffect(()=> {
        const fetchUser = async () => {
            if(friendId) {
                try {
                    const data = await getUser(friendId)
                    if(data) {
                        const {firstName,lastName,photoURL,dob,email,phone,bio,gender} = data
                        setFFirstName(firstName)
                        setFLastName(lastName)
                        setFDp(photoURL)
                        setFBio(bio)
                        setFDob(dob)
                        setFEmail(email)
                        setFPhone(phone)
                        setFGender(gender)
                    }
                    else {
                        setToast("User not found","error")
                    }
                } catch (error) {
                    setToast("Some Error occured","error")
                }
                
            
            }
        }
        fetchUser()
       
    },[friendId])

    const setContact = async(docRef:any,uid:string,contact:TContact,type:string) => {
        const send = await sendContact(docRef,uid,"",type,contact)
        if(send) {
            const message = {
              from:uid,
              content:"",
              contact,
              type,
              timestamp:Timestamp.fromDate(new Date())
            }
            
            setMessages(prevMessages => prevMessages ? [message,...prevMessages] : [message]);
            refer.current?.scrollTo(0,refer.current?.scrollHeight)
            if(socket.connected) {
              socket.emit("send_message",{uid:chatId,message})
              socket.emit("notTyping",{uid:chatId})
            }
            
            setType("text")
          }
          else {
            setToast("Something went wrong!","error")
          }
    }

    const shareContact = async() => {
        const contact: TContact = {
            uid: friendId,
            firstName: fFirstName,
            lastName: fLastName,
            photoURL: fDp,
            bio: fBio,
            dob: fDob,
            email: fEmail,
            gender: fGender,
            phone: fPhone
          }
        if(docRef) {
            setContact(docRef,uid,contact,"contact")
          }
          else {
            const docRef = doc(db,"conversations",`${uid}_${chatId}`)
            await setDoc(docRef,{user1:uid,user2:chatId},{merge:true}).then(async()=>{
              setContact(docRef,uid,contact,"contact")
              setDocRef(docRef)
            })
          }
    }
  return (
    <Box sx={{color:`${label}`,textDecoration:"none",width:"100%",display:"flex",alignItems:"center",height:"8vh",cursor:"pointer",borderRadius:"10px",'&:hover': { backgroundColor: 'white',transition:"all 0.2s" }}} onClick={shareContact}>

    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"15%",height:"100%"}}>

  <Avatar src={fDp}/>
    </Box>
  <Box sx={{width:"75%",height:"100%",alignItems:"center",display:"flex",cursor:"pointer"}}>
    <StyledText style={{fontSize:"14px",margin:"0px"}}>{fFirstName} {fLastName}</StyledText>
  </Box>
  <Box sx={{width:"10px",height:"100%",display:"flex",alignItems:"center",cursor:"pointer"}}>
    <CoPresentIcon/>
  </Box>
    </Box>
  )
}

export default SearchedContact