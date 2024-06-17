import React, { useEffect, useState } from 'react'
import { TTypesOfChat } from '../../Types/user';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { primary } from '../../StyledComponents/Global';
import { useChat } from '../../context/ChatContext';
import SearchedContact from './SearchedContact';
import SearchBar from '../Dashboard/SearchBar';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import { capitalizeFirstLetter } from '../../Controllers/Controller';

const ContactsSearch = ({setType,friendId,docRef,setDocRef,setMessages,uid,refer}:TTypesOfChat) => {
    const {friendsArr} = useChat()
    const [modifiedFriendsArr,setModifiedFriendsArr] = useState<string[]>([])
    const [filteredArr,setFilteredArr] = useState<string[]>([])
    // eslint-disable-next-line no-unused-vars
    const [open,setOpen] = useState(false)
    const [searchValue,setSearchValue] = useState<null | string>(null)
    const handleBack = ()=> {
        setFilteredArr([])
        setType("text")
        }
        const setInititalFriends = () => {
            const arr = friendsArr.filter(friend => friend !== friendId)
            setModifiedFriendsArr(arr)
        }
        useEffect(()=>{
            if(friendsArr) {
            setInititalFriends()
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[friendId, friendsArr])
        useEffect(()=> {
            const fetchData = async () => {
                if(searchValue) {
                    setFilteredArr([])
                    const val = capitalizeFirstLetter(searchValue)
                    const userRef = collection(db,"user")
                    const q = query(userRef,where("firstName","==",val))
                    const querySnapshot = await getDocs(q);
                    querySnapshot.size!==0 && querySnapshot.forEach((doc) => {
                        if(modifiedFriendsArr.includes(doc.id)) {
                            setFilteredArr([...filteredArr,doc.id])
                        }
                    });
                }
                else {
                    setFilteredArr([])
                    setInititalFriends()
                }
            }
          fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[searchValue])
  return (
    <Box sx={{width:"100%",height: "85vh",backgroundColor:`${primary}`}}>
    <Box sx={{padding:"24px",height:"inherit"}}>
    <ArrowBackIcon onClick={()=>handleBack()} sx={{cursor:"pointer"}}/>
    <Box sx={{width:"70%",margin:"auto",height:"90%",display:"flex",my:1,alignItems:"center",flexDirection:"column",gap:"10px",overflowY:"auto"}}>
        <SearchBar setOpen={setOpen} searchVal={searchValue} setSearchVal={setSearchValue} placeholder={"Filter Contacts by Name"}/>
        {
            modifiedFriendsArr.length!==0 && filteredArr.length===0?
            modifiedFriendsArr.map((friend:string)=> {
                return <SearchedContact key={friend} friendId={friend} chatId={friendId} setType={setType} docRef={docRef} setDocRef={setDocRef} setMessages={setMessages} uid={uid} refer={refer}/>
            })
            :
            filteredArr.length!==0?
            filteredArr.map((friend:string)=> {
                return <SearchedContact key={friend} friendId={friend} chatId={friendId} setType={setType} docRef={docRef} setDocRef={setDocRef} setMessages={setMessages} uid={uid} refer={refer}/>
            }):
            <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",maxHeight:"70vh",height:"65vh"}}>
                <p>Your friend list seems a bit lonely. Time to search for new connections! 🌟</p>
            </Box>
        }
    </Box>
    </Box>
</Box>
  )
}

export default ContactsSearch