"use client";
import { Avatar, Badge, Box, Grid, Tab, Tabs} from '@mui/material'
import React,{ ReactNode, useEffect, useState} from 'react'
import SearchBar from '../../../../Components/Dashboard/SearchBar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProfileAvatar from '../../../../Components/Dashboard/ProfileAvatar';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CallIcon from '@mui/icons-material/Call';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import SearchBox from '../../../../Components/Dashboard/SearchBox';
import Contacts from '../../../../Components/Dashboard/Contacts';
import Groups from '../../../../Components/Dashboard/Groups';
import Calls from '../../../../Components/Dashboard/Calls';
import { StyledGrid } from '../../../../StyledComponents/Styled';
import { useAuth } from '../../../../context/AuthContext';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import  { db} from '../../../../services/firebase.config';
import { useProfile } from '../../../../context/ProfileContext';
import { capitalizeFirstLetter, getFriends, setToast} from '../../../../Controllers/Controller';
import { TAuthUser, TFriendRequest } from '../../../../Types/user';
import { socket } from '../../../../socket';
import Notifications from '../../../../Components/Notifications/Notifications';
import { useChat } from '../../../../context/ChatContext';
import { useCall } from '../../../../context/CallContext';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';


type LayoutProps = {
    children: ReactNode;
  };

const Layout = ({children}:LayoutProps) => {
  const router = useRouter()
  useEffect(()=> {
    if(!getCookie("uid")) {
      router.push("/auth/login")
    }
  },[router])
  const {incomingCall,setIncomingCall,setCaller,setCallerName,setCallerDp,setCallerSignal} = useCall()
  const [notificationSent,setNotificationSent] = useState(false)
  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
    socket.on("joined_room",(data)=> {
      console.log(`user ${data.uid} joined room ${data.uid}`)
    })
    socket.on("friend_request",(data)=> {
      console.log(data)
      if(!notificationSent) {
        setToast(data,"")
        setNotificationSent(true)
      }
    })
    socket.on("friend_req_unsent",(data)=>{
      console.log(data)
      setToast(data,"")
    })
    socket.on("incoming_call",(data)=> {
      console.log("call is coming")
      if(!incomingCall) {
        console.log("incoming call")
        setIncomingCall(true)
        setCaller(data.from)
        setCallerName(data.profileData.name)
        setCallerDp(data.profileData.dp)
        setCallerSignal(data.signalData)
      }
      else {
        if(uid) {
          socket.emit("busyCall",{caller:data.from,me:uid})

        }
      }
    })
   
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
   
    return () => {
      // Disconnect from the server when the component unmounts
      socket.disconnect();
      socket.off("friend_request")
      socket.off("joined_room")
      socket.off("friend_req_unsent")
      socket.off("incoming_call")
      socket.off("busy_call")
      
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {uid} =useAuth()
  const {setSenderColor,setRecieverColor,setBgType,setBgImage,setBgColor} = useProfile()
  const {blockedUsers,isBlockedByArr,friendsArr,setFriendCount,setFriends} = useChat()
    const [value, setValue] = useState(0);
  const [open,setOpen] = useState(false);
  const [searchVal,setSearchVal] = useState<string | null>(null);
  const [searchContactArr,setSearchContactArr] = useState<TAuthUser[]>([])
  const [friendReqArr,setFriendReqArr] = useState<TFriendRequest[]>([])
  const [openNotis,setOpenNotis] = useState(false)
  const [reqCount,setReqCount] = useState(0)
  // eslint-disable-next-line no-unused-vars

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.log(newValue)
    setValue(newValue);
  };
  useEffect(() => {
    let unsubscribe = () => {}; 
  
    if (uid) {
      const reqRef = doc(db, "friendRequests", uid);
      unsubscribe = onSnapshot(reqRef, (doc) => {
        if (doc.exists()) {
          const { requests } = doc.data();
          console.log(requests)
          setReqCount(requests.length);
        }
      });
  
      socket.emit('join_room', { uid });
  
      const docRef = doc(db, "backgrounds", uid);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data) {
            setSenderColor(data.sendercolor);
            setRecieverColor(data.recieverColor);
            setBgType(data.bgType);
            if (data.bgType === 'Aesthetic') {
              setBgImage(data.bgImage);
            } else {
              setBgColor(data.bgColor);
            }
          }
        }
      });
    }
  
    return () => {
      unsubscribe(); 
    };
  }, [setBgColor, setBgImage, setBgType, setRecieverColor, setSenderColor, uid,setReqCount]);
  useEffect(()=> {
    const fetchFriends = async()=> {
      if(uid) {
        const data = await getFriends(uid)
        if(data) {
          setFriends(data.friendsArr)
          setFriendCount(data.count)
        }
      }
    }
    fetchFriends()
  },[setFriendCount,setFriends,uid])

  useEffect(() => {
    if(value===0) {
      const fetchData = async () => {
        if(searchVal) {

          const userRef = collection(db, "user");
          const val = capitalizeFirstLetter(searchVal);
          const q = query(userRef, where("firstName", "==", val), where("uid", "!=", uid));
         
          const snapshot = await getDocs(q);
    
          const newData: any[] = [];
    
          snapshot.docs.forEach((doc) => {
            // handle blocked requests
            if(!isBlockedByArr.includes(doc.id))
            if(!blockedUsers.includes(doc.id)) {
              newData.push({ id: doc.id, ...doc.data(), isBlocked: false });
              // console.log(newData[0].isBlocked)
            }else {
              console.log("didnt")
              newData.push({ id: doc.id, ...doc.data(),isBlocked:true });
              // console.log(newData[0].isBlocked)
            }
          });
          // console.log(newData)
          setSearchContactArr(newData);
        }
      }
  
      fetchData();
    }
  }, [blockedUsers, isBlockedByArr, searchVal, uid, value]);
  const handleNotis = ()=>{
    if(open && !openNotis) {
      setOpen(false)
    
    }
    setOpenNotis(!openNotis)
  }

  return (
    <>
        <Grid container>
    <Grid item xs={4} sx={{maxHeight:"100vh",overflow:"auto"}} >
      <Box sx={{ flexGrow: 1,height:"100px" }}>
        <Box sx={{display:"flex",alignItems:"center",justifyContent:'space-around'}}>
      <Avatar src='/logo.png'></Avatar>
      <SearchBar setOpen={setOpen} searchVal={searchVal} setSearchVal={setSearchVal} setSearchContactArr={setSearchContactArr}/>
      <Badge badgeContent={reqCount} color="success" sx={{cursor:"pointer"}} onClick={()=>handleNotis()}>
      <NotificationsIcon color="action" />
    </Badge>
      <ProfileAvatar/>
      </Box>
      <Notifications openNotis = {openNotis} setOpenNotis={setOpenNotis} friendReqArr={friendReqArr} setFriendReqArr={setFriendReqArr}/>
      <TabContext value={value.toString()}>
      <Tabs value={value} onChange={handleChange} variant='fullWidth' textColor={'secondary'} indicatorColor={'secondary'} sx={{justifyContent:"space-around"}} aria-label="icon label tabs example">
        <Tab icon={<PersonIcon />} label="PERSON" value={0} />
        <Tab icon={<GroupsIcon />} label="GROUPS" value={1} />
        <Tab icon={<CallIcon />} label="CALL LOGS" value={2} />
      </Tabs>
      <TabPanel value="0">
        <SearchBox open={open} value={value} setOpen={setOpen} openNotis={openNotis} setOpenNotis={setOpenNotis} searchContactArr={searchContactArr}/>
        <Contacts friendsArr={friendsArr}/>
      </TabPanel>
      <TabPanel value="1">
      <SearchBox open={open} value={value} setOpen={setOpen} openNotis={openNotis} setOpenNotis={setOpenNotis} searchContactArr={searchContactArr}/>
        <Groups/>
      </TabPanel>
      <TabPanel value="2">
      <SearchBox open={open} value={value} setOpen={setOpen} openNotis={openNotis} setOpenNotis={setOpenNotis} searchContactArr={searchContactArr}/>
       <Calls friendsArr={friendsArr}/>
      
      </TabPanel>
    </TabContext>
        </Box>
    </Grid>
    <StyledGrid item xs={8}>
    {children}
    </StyledGrid>
    </Grid>
    </>
  )
}

export default Layout