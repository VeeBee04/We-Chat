import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import Footer from "./Footer";
import EmojiPicker from "emoji-picker-react";
import { useProfile } from "../../context/ProfileContext";
import { db } from "../../services/firebase.config";
import { Timestamp, collection, doc, getDoc, getDocs,limit,orderBy,query,setDoc} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { TChatType } from "../../Types/user";
import { socket } from "../../socket";
import MediaUpload from "./MediaUpload";
import CameraUpload from "./CameraUpload";

import ContactsSearch from "./ContactsSearch";
import AudioShare from "./AudioShare";
import TextBox from "./TextBox";
import FriendProfile from "./FriendProfile";

type Props = {
    friendId:string,
}
const ChatScreen = ({friendId}:Props) => {
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
    useEffect(() => {
      const fetchConversations = async () => {
        console.log("Ran for the first time")
        const docRef1 = doc(db, "conversations", `${uid}_${friendId}`);
        const docRef2 = doc(db, "conversations", `${friendId}_${uid}`);
        const [docs1, docs2] = await Promise.all([getDoc(docRef1), getDoc(docRef2)]);
        if(!docs1.exists() && !docs2.exists()) {
          await setDoc(docRef1,{user1:uid,user2:friendId})
          setHasMore(false)
        }
        else {
      const existingDocRef = docs1.exists() ? docRef1 : docRef2;
      setDocRef(existingDocRef);
      const messagesRef = collection(existingDocRef, 'messages');
const orderedMessagesRef = query(messagesRef, orderBy("timestamp", "desc"),limit(12));
const messageDocs = await getDocs(orderedMessagesRef);
      const messages = messageDocs.docs.map(doc => doc.data() as TChatType);
      console.log(messages)
      setMessages(messages);
      messages.length===0 && setHasMore(false)
      setLastFetchedChat(messages[messages.length-1])
        }
      };
      if(friendId && uid) fetchConversations();
      
    }, [friendId, uid]);

  const handleEmoji = (emoji: any) => {
    console.log(emoji.emoji);
    setSearchValue((searchValue) => searchValue.concat(emoji.emoji));
  };
  // eslint-disable-next-line no-unused-vars

  // useEffect(()=> {
  //   console.log(messages)
  // },[messages])

  useEffect(()=>{
    socket.on("add_message",(data:TChatType)=> {
      // console.log(data.from,friendId)
      if(data.from === friendId) {
      if (!(data.timestamp instanceof Timestamp)) {
        console.log("not instance of timestamp")
        data.timestamp = Timestamp.fromDate(new Date())
      }
      console.log(data)
      setMessages(prevMessages => prevMessages ? [data,...prevMessages] : [data]);
    }
    })
    return ()=> {
      socket.off("add_message")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Navbar setOpenFProfile={setOpenFProfile} friendId={friendId}/>
        </Box>
        <FriendProfile setOpenFProfile={setOpenFProfile} openFProfile={openFProfile}/>
        {type==='text'?
        <TextBox setMessages={setMessages} docRef={docRef} uid={uid} setLastFetchedChat={setLastFetchedChat} hasMore={hasMore} lastFetchedChat={lastFetchedChat} messages={messages} recieverColor={recieverColor} sendercolor={sendercolor} setHasMore={setHasMore}  refer={ref}/>:
        type==='media'?<MediaUpload setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={friendId} refer={ref}/>
        :
        type==='camera'?<CameraUpload setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={friendId} refer={ref}/>:
        type==='contacts'?<ContactsSearch setMessages={setMessages} setDocRef={setDocRef} setType={setType} docRef={docRef} uid={uid} friendId={friendId} refer={ref}/>
        :type==='audio'?<AudioShare setType={setType} docRef={docRef} uid={uid} setMessages={setMessages} setDocRef={setDocRef} friendId={friendId} refer={ref}/>:null}
        <Box sx={{ width: "100%", height: "7vh" }}>
          {openEmoji ? (
            <Box style={{ width: "100%", position: "fixed", bottom: "7vh",zIndex:"2" }}>
              <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
            </Box>
          ) : null}

          {!openFProfile && <Footer openEmoji={openEmoji} setOpenEmoji={setOpenEmoji} searchValue={searchValue} setSearchValue={setSearchValue} docRef={docRef} uid={uid} messages={messages} friendId={friendId} setMessages={setMessages} type={type} setType={setType} setDocRef={setDocRef} refer={ref}
          />}
        </Box>
      </Box>
    </>
  );
};

export default ChatScreen;
