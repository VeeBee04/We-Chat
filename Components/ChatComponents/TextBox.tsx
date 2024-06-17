import React from 'react'
import Linkify from "linkify-react";
import CustomImage from "./CustomImage";

import { fetchMoreChats } from "../../Controllers/Controller";
import InfiniteScroll from "react-infinite-scroll-component";
import AudioBox from "./AudioBox";
import { v4 } from "uuid";
import ContactBox from "./ContactBox";
import { Box, CircularProgress, Typography } from '@mui/material';
import { TChatType } from '../../Types/user';
import { text } from '../../StyledComponents/Global';
type Props = {
    messages: TChatType[]|null;
    setMessages: React.Dispatch<React.SetStateAction<TChatType[]|null>>;
    docRef: any;
    lastFetchedChat: TChatType|null;
    setLastFetchedChat: React.Dispatch<React.SetStateAction<TChatType|null>>;
    uid: string;
    sendercolor: string;
    recieverColor: string;
    hasMore: boolean;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    refer: React.RefObject<HTMLDivElement>;
    
}
const TextBox = ({messages,setMessages,docRef,lastFetchedChat,setLastFetchedChat,hasMore,recieverColor,refer,sendercolor,setHasMore,uid}:Props) => {

    const fetchNext = async()=> {
        await fetchMoreChats(docRef,lastFetchedChat,4).then((data)=> {
          setMessages(prevMessages => prevMessages && data? [...prevMessages, ...data] : [...data]);
          if(data.length<4) {
            setHasMore(false)
          }
          else {
            setLastFetchedChat(data[data.length-1])
          }
        })
      }
  return (
    <Box ref={refer} id={'scrollableDiv'} sx={{ height: "750px", overflowY: "scroll",overflowX:"hidden",display:"flex",flexDirection: 'column-reverse' }}>
    <InfiniteScroll
dataLength={messages?.length || 0}
next={()=>fetchNext()}
style={{ display: 'flex', flexDirection: 'column-reverse' ,overflowY:"auto",overflowX:"hidden"}} 
inverse={true} 
hasMore={hasMore}
loader={<Box sx={{width:"100%",display:"flex",justifyContent:"center"}}><CircularProgress sx={{color:text}} /></Box>}
scrollableTarget="scrollableDiv"
>
    {messages && messages.length>0 ? (
      messages.map((message, index) =>
      
        message.from === uid ? (
          
          <Box
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "10px",
              overflowAnchor:"auto"
            }}
          >
            <Box
              sx={{
                width: "fit-content",
                padding: "10px",
                backgroundColor: `${sendercolor}`,
                borderRadius: "10px",
                marginRight: "20px",
                minWidth:"60px"
              }}
            >
              {
              message.type==="text"?
              <Linkify color="black" as="span" size={14} style={{ fontSize: "14px", color: "black" }}>
                {message.content}
              </Linkify>:
              message.type==="media" || message.type==="camera"?<CustomImage src={message.content}/>:
              message.type==="contact"? <ContactBox contact={message.contact} from={"sender"}/>:
              message.type==="audio"? <AudioBox audioUrl={message.content} id={`id${v4()}`}/>:null
              }
              <Typography
                style={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "right",
                }}
              >
                {message.timestamp.toDate().getHours()}:{message.timestamp.toDate().getMinutes()}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Box
              sx={{
                width: "fit-content",
                padding: "10px",
                backgroundColor: `${recieverColor}`,
                borderRadius: "10px",
                minWidth:"60px"
              }}
            >
              {
              message.type==="text"?
              <Linkify color="black" as={"span"} size={14} style={{ fontSize: "14px", color: "white" }}>
                {message.content}
              </Linkify>:
              message.type==="media" || message.type==="camera"?<CustomImage src={message.content}/>:
              message.type==="contact"? <ContactBox contact={message.contact} from={"reciever"}/>:
              message.type==="audio"? <AudioBox audioUrl={message.content} id={`id${v4()}`}/>:null
              }
              <Typography
                style={{
                  fontSize: "10px",
                  color: "white",
                  textAlign: "right",
                }}
              >
                {message.timestamp.toDate().getHours()}:{message.timestamp.toDate().getMinutes()}
              </Typography>
            </Box>
          </Box>
        )
      )
    ) 
    : (
      <Box
        sx={{
          width: "100%",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography style={{ fontSize: "1.5rem", color: "white" }}>
          Start a conversation
        </Typography>
      </Box>
    )}
    </InfiniteScroll>
  </Box>
  )
}

export default TextBox