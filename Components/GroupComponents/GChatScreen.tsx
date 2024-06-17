import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Footer from "../ChatComponents/Footer";
import EmojiPicker from "emoji-picker-react";
import { useProfile } from "../../context/ProfileContext";
import { db } from "../../services/firebase.config";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs,limit,orderBy,query,setDoc} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { TChatType } from "../../Types/user";
import { socket } from "../../socket";
import MediaUpload from "../ChatComponents/MediaUpload";
import CameraUpload from "../ChatComponents/CameraUpload";

import ContactsSearch from "../ChatComponents/ContactsSearch";
import AudioShare from "../ChatComponents/AudioShare";
import TextBox from "../ChatComponents/TextBox";
import GroupNavbar from "../GroupComponents/GroupNavbar";
import GroupProfile from "../GroupComponents/GroupProfile";

type Props = {
    groupId:string,
}
const GChatScreen = ({groupId}:Props) => {
    const {uid} = useAuth()
    const [hasMore,setHasMore] = useState(true)
    const [lastFetchedChat,setLastFetchedChat] = useState<TChatType|null>(null)
    const {bgColor,bgImage,bgType,sendercolor,recieverColor} = useProfile();
    const [messages, setMessages] = useState<TChatType[]|null>([])
    const [docRef,setDocRef] = useState<null|any>(null)
    const [openEmoji, setOpenEmoji] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [type,setType] = useState("text")
    const [openFProfile,setOpenFProfile] = useState(false)
    const ref = useRef<HTMLDivElement>(null);
useEffect(()=> {
    const fetchConversations = async()=> {
        if(groupId) {
            const docRef = doc(db,"groupChats",groupId)
            setDocRef(docRef)
            const docs = await getDoc(docRef)
            if(!docs.exists()) {
                await setDoc(docRef,{groupId});
                const messagesRef = collection(docRef, "messages");
                await addDoc(messagesRef, {});
                setHasMore(false)
            }
            else {
                
                const messagesRef = collection(docRef,"messages")
                const orderedMessagesRef = query(messagesRef, orderBy("timestamp", "desc"),limit(12));
                const messageDocs = await getDocs(orderedMessagesRef);
                const messages = messageDocs.docs.map(doc => doc.data() as TChatType);
                setMessages(messages);
                messages.length===0 && setHasMore(false)
                setLastFetchedChat(messages[messages.length-1])
            
            }
        }
    }
    fetchConversations()
},[groupId])

  const handleEmoji = (emoji: any) => {
    console.log(emoji.emoji);
    setSearchValue((searchValue) => searchValue.concat(emoji.emoji));
  };
  // eslint-disable-next-line no-unused-vars

  useEffect(()=> {
    console.log(messages)
  },[messages])

  useEffect(()=>{
    socket.on("add_message",(data)=> {
      console.log("socket chala")
      if (!(data.timestamp instanceof Timestamp)) {
        console.log("not instance of timestamp")
        data.timestamp = Timestamp.fromDate(new Date())
      }
      console.log(data)
      setMessages(prevMessages => prevMessages ? [data,...prevMessages] : [data]);
    })
    return ()=> {
      socket.off("add_message")
    }
  },[])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
        background:bgType==='Solid'?bgColor:`url(/${bgImage})`,
          backgroundSize: "cover",
            backgroundRepeat: "no-repeat",

        }}
      >
        <Box sx={{ width: "100%", position: "relative" }}>
          <GroupNavbar setOpenFProfile={setOpenFProfile}/>
        </Box>
        <GroupProfile setOpenFProfile={setOpenFProfile} openFProfile={openFProfile}/>
        
        {type==='text'?
        <TextBox setMessages={setMessages} docRef={docRef} uid={uid} setLastFetchedChat={setLastFetchedChat} hasMore={hasMore} lastFetchedChat={lastFetchedChat} messages={messages} recieverColor={recieverColor} sendercolor={sendercolor} setHasMore={setHasMore}  refer={ref}/>:
        type==='media'?<MediaUpload setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={groupId} refer={ref}/>
        :
        type==='camera'?<CameraUpload setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={groupId} refer={ref}/>:
        type==='contacts'?<ContactsSearch setMessages={setMessages} setDocRef={setDocRef} setType={setType} docRef={docRef} uid={uid} friendId={groupId} refer={ref}/>
        :type==='audio'?<AudioShare setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={groupId} refer={ref}/>:null}
        <Box sx={{ width: "100%", height: "7vh" }}>
          {openEmoji ? (
            <Box style={{ width: "100%", position: "fixed", bottom: "7vh",zIndex:"2" }}>
              <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
            </Box>
          ) : null}

          {!openFProfile && <Footer openEmoji={openEmoji} setOpenEmoji={setOpenEmoji} searchValue={searchValue} setSearchValue={setSearchValue} docRef={docRef} uid={uid} messages={messages} friendId={groupId} setMessages={setMessages} type={type} setType={setType} setDocRef={setDocRef} refer={ref}
          />}
        </Box>
      </Box>
    </>
  );
};

export default GChatScreen;
