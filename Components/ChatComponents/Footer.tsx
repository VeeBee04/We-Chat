import React, { useEffect, useState } from 'react';
import { primary, text, title } from '../../StyledComponents/Global';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { AppBar, Toolbar, TextField, Box, InputAdornment, IconButton} from '@mui/material';
import { sendMessage, setToast } from '../../Controllers/Controller';
import { TChatType } from '../../Types/user';
import { socket } from '../../socket';
import ControlledOpenSpeedDial from './SpeedDial';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';

type Props = {
    openEmoji: boolean;
    setOpenEmoji: React.Dispatch<React.SetStateAction<boolean>>;
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    docRef:any|null;
    uid:string;
    messages:TChatType[]|null;
    setMessages:React.Dispatch<React.SetStateAction<TChatType[]|null>>;
    friendId:string;
    type:string;
    setType:React.Dispatch<React.SetStateAction<string>>;
    setDocRef:React.Dispatch<React.SetStateAction<any|null>>;
    refer:React.RefObject<HTMLDivElement>;
}

const Footer = ({openEmoji,setOpenEmoji,searchValue,setSearchValue,docRef,uid,setMessages,friendId,messages,type,setType,setDocRef,refer}:Props) => {
  const [disabled,setDisabled] = useState(false)
  // eslint-disable-next-line no-unused-vars
  useEffect(()=> {
    if(location.pathname === '/profile') {
        setDisabled(true)
    }

},[disabled])
useEffect(()=> {
  console.log(docRef)
},[docRef])
const sendMsg = async(docRef:any,uid:string,searchValue:string,type:string)=> {
  const send:boolean = await sendMessage(docRef,uid,searchValue,type)
  if(send) {
    const message = {
      from:uid,
      content:searchValue,
      type,
      timestamp:Timestamp.fromDate(new Date())
    }
    // console.log(send)
    
    setMessages(prevMessages => prevMessages ? [message,...prevMessages] : [message]);
    refer.current?.scrollTo(0,refer.current?.scrollHeight)
    if(socket.connected) {
      socket.emit("send_message",{uid:friendId,message})
      socket.emit("notTyping",{uid:friendId,msgSentBy:uid})
    }
    setSearchValue("")
  }
  else {
    setToast("Something went wrong!","error")
  }
}
const handleSendMsg = async()=> {
  
  if(docRef) {
   sendMsg(docRef,uid,searchValue,type)

  }
  else {
    const docRef = doc(db,"conversations",`${uid}_${friendId}`)
    await setDoc(docRef,{user1:uid,user2:friendId},{merge:true}).then(async()=>{
      sendMsg(docRef,uid,searchValue,type)
      setDocRef(docRef)
    })
  }
}
const setSearch = (value:string) => {
  setSearchValue(value)
  if(socket.connected) {
    if(value.length!==0) {
    socket.emit("isTyping",{uid:friendId,msgSentBy:uid})
    }
    else {
      socket.emit("notTyping",{uid:friendId,msgSentBy:uid})
    }
  }
}
  return (
    <AppBar sx={{ top: 'auto', bottom: 0,position:"inherit",backgroundColor:primary}}>
      <Toolbar sx={{paddingLeft:"5px !important"}}>
        {

            openEmoji? <CloseIcon sx={{color:text,padding:"10px",cursor:"pointer"}} onClick={()=>setOpenEmoji(false)}/>:<EmojiEmotionsIcon sx={{color:title,padding:"10px",cursor:"pointer"}} onClick={()=>setOpenEmoji(true)}/>
        }
        <TextField
        disabled={disabled}
          variant="outlined"
          placeholder="Type a message"
          fullWidth
          sx={{ mr: 5 }}
          value={searchValue}
          onChange={(e)=>setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendMsg} disabled={searchValue.length===0}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ position: 'absolute', bottom: 5, right: 5 }}>
          <ControlledOpenSpeedDial setType={setType}/>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
