import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button } from "@mui/material";
import { StyledText } from "../../StyledComponents/Styled";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { motion, AnimatePresence } from 'framer-motion';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import ChatIcon from '@mui/icons-material/Chat';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { useChat } from '../../context/ChatContext';
import { socket } from '../../socket';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import type { TAuthUser } from '../../Types/user';
import BlockIcon from '@mui/icons-material/Block';
import { setToast } from '../../Controllers/Controller';

type Props = {
  value: number;
  contact: TAuthUser;
};

const SearchContact = ({ value, contact }: Props) => {
  const { uid: mUid } = useAuth();
  const { firstName: mFirstName, lastName: mLastName,dp:mDp } = useProfile();
  const {setFriends} = useChat()
  const { firstName, lastName, uid, photoURL,isBlocked } = contact;
  const { friendsArr,setBlockedUsers } = useChat();
  const [blockedStatus,setBlockedStatus] = useState(false)
  useEffect(()=> {
    if(isBlocked) {
      setBlockedStatus(true)
    }
  }
  ,[isBlocked])
  // eslint-disable-next-line no-unused-vars
  const [isFriend, setIsFriend] = useState(false);
  const [isReqPending, setIsReqPending] = useState<boolean | null>(null);
  useEffect(() => {
    if (uid && friendsArr) {
      if (friendsArr.includes(uid)) {
        setIsFriend(true);
      } else {
        let unsubscribe = () => {};
        if (uid) {
          console.log({uid})
          const reqRef = doc(db, "friendRequests", uid);
          const friendRef = doc(db, "friends", uid);
          unsubscribe = onSnapshot(reqRef, (doc) => {
            if (doc.exists()) {
              const { requests } = doc.data();
              
              if (requests.some((request: any) => request.uid === mUid)) {
                setIsReqPending(true);
              } else {
                getDoc(friendRef).then((doc) => {
                  if(doc.exists()) {
                    const {friendsArr} = doc.data()
                    console.log({friendsArr})
                    if(!friendsArr.includes(mUid)) {
                      setIsReqPending(false);
                    
                    }
                    else {
                      setFriends([...friendsArr,uid])
                      setIsReqPending(null)
                    }
                  }
                })
                // setIsReqPending(false);
              }
            }
          });
        }

        return () => {
          unsubscribe();
        };
      }
    }
  }, [uid, friendsArr, mUid, setFriends]);

  const handleClick = async () => {
    const reqRef = doc(db, "friendRequests", uid);
    if (isReqPending) {
      // eslint-disable-next-line no-unused-vars
      const reqSnap = await getDoc(reqRef).then((doc) => {
        if (doc.exists()) {
          const { requests } = doc.data();
          const newRequests = requests.filter(
            (request: any) => request.uid !== mUid
          );
          setDoc(reqRef, { requests: newRequests },{merge:true}).then(() => {
            setIsReqPending(false);
            if (socket.connected) {
              socket.emit("remove_request", {
                uid: mUid,
                message: "Friend request has been unsent",
              });
            }
          });
        }
      });
    } else {
      console.log("sending request")
      // eslint-disable-next-line no-unused-vars
      const reqSnap = await getDoc(reqRef).then((doc)=> {
        if(doc.exists()) {
          const {requests} = doc.data()
          const request = {
            uid: mUid,
            firstName: mFirstName,
            lastName: mLastName,
            photoURL: mDp,
            timestamp: new Date()
          };
          const newRequests = [...requests,request]
          setDoc(reqRef, { requests: newRequests },{merge:true}).then(() => {
            setIsReqPending(true);
            if (socket.connected) {
              socket.emit("add_friend", {
                friendId: uid,
                message: `${mFirstName} ${mLastName} sent you a friend request`,
              });
            }
          });
        }
      });
    }
  };
const unblock = async()=> {
  const blockedRef = doc(db,"blockedUsers",mUid)
  const blockedSnap = await getDoc(blockedRef)
  if(blockedSnap.exists()) {
    const {ids} = blockedSnap.data()
    const newIds = ids.filter((id:string)=>id!==uid)
    await setDoc(blockedRef,{ids:newIds},{merge:true}).then(()=> {
      setBlockedStatus(false)
      setBlockedUsers(newIds)
      setToast("User unblocked","success")
    })
  }
  const blockedRef2 = doc(db,"blockedUsers",uid)
  const blockedSnap2 = await getDoc(blockedRef2)
  if(blockedSnap2.exists()) {
    const {isBlockedBy} = blockedSnap2.data()
    const newIds = isBlockedBy.filter((id:string)=>id!==mUid)
    await setDoc(blockedRef2,{isBlockedBy:newIds},{merge:true})
  }
}

  return (
    <Box sx={{ width: "100%", height: "10%", display: "flex", my: 1, alignItems: "center", gap: "10px", padding: "14px" }}>
      <Avatar src={photoURL} />
      <Box sx={{ width: "78%", height: "100%", alignItems: "center", display: "flex" }}>
        <StyledText style={{ fontSize: "14px", margin: "0px" }}>{firstName} {lastName}</StyledText>
      </Box>
      <AnimatePresence>
        {isReqPending === null ? (
          <motion.div key="chatIcon"><ChatIcon /></motion.div>
        ) : (
          <motion.div
            key={isReqPending ? 'requestPending' : 'requestNotPending'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {blockedStatus? 
            <Button variant='outlined' sx={{color:"lightgray",width:"80px",borderRadius:"10px",fontSize:"9px",borderColor:"lightGray",":hover":{borderColor:"lightgray"}}} startIcon={<BlockIcon/>} onClick={unblock}>Blocked</Button>
            :
            !isReqPending ? (
              value === 0 ? <PersonAddIcon sx={{ pr: "10px", cursor: "pointer" }} onClick={handleClick} /> :
                value === 1 ? <GroupAddIcon sx={{ pr: "10px", cursor: "pointer" }} onClick={()=>console.log("group clicked")} /> :
                <AddIcCallIcon sx={{ pr: "10px", cursor: "pointer" }} onClick={()=>console.log("call clicked")} />
            ) : (
              <MarkEmailReadIcon sx={{ pr: "10px", cursor: "pointer" }} onClick={()=>console.log("chat clicked")} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SearchContact;
