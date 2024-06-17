import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { auth, db } from '../services/firebase.config';
import { toast } from 'react-toastify';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter } from 'firebase/firestore';
import { TAuthUser, TChatType, TContact, TFriendsType, TGroupType } from '../Types/user';
const phoneUtil = PhoneNumberUtil.getInstance();
export const isPhoneValid = (phone: string) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

 export const sendOtp = async(muiPhone:string)=>{

    if(!isPhoneValid(muiPhone)) {
      return {success:false,error:"Phone number invalid"}
    }
    try {

      const appVerifier = new RecaptchaVerifier(auth, 'recaptcha', {});
      const confirmation = await signInWithPhoneNumber(auth,muiPhone,appVerifier)
      console.log(confirmation)
      window.confirmationResult = confirmation;
      return {success:true,error:null}
    }
    catch(err) {
      console.log(err)
      return {success:false,error:"Something went wrong"}
    }
  }
export const setToast = (message:string,type:string) => {
  console.log(message)
  switch (type) {
    case "error":
      toast.error(message,{
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
      });
      break;
    case "success":
      toast.success(message,{
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
      })
      break
    default:
      toast(message,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
          })
      break;
  }
  
}
export function capitalizeFirstLetter(str:string) {
  str = str.toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getUser = async(uid:string)=> {
  const userRef = doc(db,"user",uid)
  return getDoc(userRef).then((doc)=> {
    if(doc.exists()) {
      return doc.data() as TAuthUser
    }
    else {
      return null
    }
  })
}

export const getFriends = async(uid:string)=> {
  const friendsRef = doc(db,"friends",uid)
  return getDoc(friendsRef).then((doc)=> {
    if(doc.exists()) {
      return doc.data() as TFriendsType
    }
    else {
      return null
    }
  
  })
}

export const rejectReq = async(mUid:string,uid:string) => {
  const reqRef = doc(db, "friendRequests", mUid);
  const docSnap = await getDoc(reqRef);
  if (docSnap.exists()) {
      const { requests } = docSnap.data();
      console.log(requests)
      const newRequests = requests.filter(
          (request: any) => request.uid !== uid
      );
      return setDoc(reqRef,{requests:newRequests},{merge:true}).then(()=> {
         return true
      })
  }
  else{
      return false
  }
}
export const unblockUser = async(mUid:string,uid:string)=> {
  const mBlockRef = doc(db,"blockedUsers",mUid)
  const mBlockSnap = await getDoc(mBlockRef)
  if(mBlockSnap.exists()) {
    const {ids} = mBlockSnap.data()
    const newIds = ids.filter((id:string)=> id !== uid)
    await setDoc(mBlockRef,{ids:newIds},{merge:true})
  }
  const blockRef = doc(db,"blockedUsers",uid)
  const blockSnap = await getDoc(blockRef)
  if(blockSnap.exists()) {
    const {isBlockedBy} = blockSnap.data()
    const newIds = isBlockedBy.filter((id:string)=> id !== mUid)
    await setDoc(blockRef,{isBlockedBy:newIds},{merge:true})
  }
}
export const fetchMoreChats = async(docRef:any,lastFetchedChat:TChatType|null,lim:number)=> {
  console.log("fetching more messages",lastFetchedChat)
  const messagesRef = collection(docRef, 'messages');
  const orderedMessagesRef = query(messagesRef, orderBy("timestamp", "desc"),startAfter(lastFetchedChat?.timestamp), limit(lim));
const messageDocs = await getDocs(orderedMessagesRef);
// return the messages
const messages = messageDocs.docs.map(doc => doc.data() as TChatType);
// console.log(messages)
return messages
}

export const sendMessage = async (docRef:any,from:string,content:string,type:string): Promise<boolean>=> {
  console.log({docRef})
  const messageRef = collection(docRef,"messages")
  
  const message = {
    from,
    content,
    type,
    timestamp:serverTimestamp()
  }
  return setDoc(doc(messageRef),message).then(()=> {
    return true
  }).catch((err)=> {
    console.log(err)
    return false
  }
  )
}
export const sendContact = async (docRef:any,from:string,content:string,type:string,contact:TContact): Promise<boolean>=> {
  const messageRef = collection(docRef,"messages")
  
  const message = {
    from,
    content,
    contact,
    type,
    timestamp:serverTimestamp()
  }
  return setDoc(doc(messageRef),message).then(()=> {
    return true
  }).catch((err)=> {
    console.log(err)
    return false
  }
  )
}
export const checkIfFriend = async(uid:string,friendId:string) => {
  console.log(friendId)
  const friendRef = doc(db,"friends",friendId)
  const friendSnap = await getDoc(friendRef)
  if(friendSnap.exists()) {
    const {friendsArr} = friendSnap.data()
    if(friendsArr.includes(uid)) {
      return true
    }
    else {
      return false
    }
  }
}
export const fetchGroups = async(uid:string)=> {
  const userRef = doc(db,"user",uid)
  const userSnap = await getDoc(userRef)
  if(userSnap.exists()) {
    const {groups} = userSnap.data()
    return groups
  }
  else {
    return []
  }
}
export const fetchGroupDetails = async(groupId:string)=> {
  const groupRef = doc(db,"groups",groupId)
  const groupSnap = await getDoc(groupRef)
  if(groupSnap.exists()) {
    return groupSnap.data() as TGroupType
  }
  else {
    return null
  }
}
export const removeMember = async(groupId:string,uid:string)=> {
  const groupRef = doc(db,"groups",groupId)
  const groupSnap = await getDoc(groupRef)
  if(groupSnap.exists()) {
    const {members} = groupSnap.data() as TGroupType
    const newMembers = members.filter((member)=> member !== uid)
    return setDoc(groupRef,{members:newMembers},{merge:true}).then(async()=> {
      const userRef = await getDoc(doc(db,"user",uid))
        if(userRef.exists()) {
          const {groups} = userRef.data() as TAuthUser
          const newGroups = groups.filter((group)=> group !== groupId)
          setDoc(doc(db,"user",uid),{groups:newGroups},{merge:true}).then(()=> {
            return true
          }
          ).catch((err)=> {
            console.log(err)
            return false
          }
          )
        }
    }).catch((err)=> {
      console.log(err)
      return false
    })
  }
}
export const updateGroup = async(groupId:string,name:string,dp:string,newMembers:string[])=> {
  const groupRef = doc(db,"groups",groupId)
  const groupSnap = await getDoc(groupRef)
  if(groupSnap.exists()) {
    const {members} = groupSnap.data() as TGroupType
    const totMembers = [...members,...newMembers]
    return setDoc(groupRef,{groupId,name,dp,members:totMembers},{merge:true}).then(()=> {
      newMembers.forEach(async(member)=> {
        const userRef = doc(db,"user",member)
        const userSnap = await getDoc(userRef)
        if(userSnap.exists()) {
          const {groups} = userSnap.data() as TAuthUser
         return setDoc(userRef,{groups:[...groups,groupId]},{merge:true}).then(()=> {
           return true
         }
          ).catch((err)=> {
            console.log(err)
            return false
          })
          
        }
      })
    }).catch((err)=> {
      console.log(err)
      return false
    })
  }
}
export const leaveGroup = async(groupId:string,uid:string,newAdmin:string)=> {
  const groupRef = doc(db,"groups",groupId)
  const groupSnap = await getDoc(groupRef)
  if(groupSnap.exists()) {
    const {members} = groupSnap.data() as TGroupType
    const newMembers = members.filter((member)=> member !== uid)
    if(newAdmin!=='') {
      return setDoc(groupRef,{members:newMembers,admin:newAdmin},{merge:true}).then(async()=> {
        const userRef = await getDoc(doc(db,"user",uid))
        if(userRef.exists()) {
          const {groups} = userRef.data() as TAuthUser
          const newGroups = groups.filter((group)=> group !== groupId)
          setDoc(doc(db,"user",uid),{groups:newGroups},{merge:true}).then(()=> {
            return true
          }
          ).catch((err)=> {
            console.log(err)
            return false
          }
          )
        }
      }).catch((err)=> {
        console.log(err)
        return false
      })
    
    }
    else {

      return setDoc(groupRef,{members:newMembers},{merge:true}).then(async()=> {
        const userRef = await getDoc(doc(db,"user",uid))
        if(userRef.exists()) {
          const {groups} = userRef.data() as TAuthUser
          const newGroups = groups.filter((group)=> group !== groupId)
          setDoc(doc(db,"user",uid),{groups:newGroups},{merge:true}).then(()=> {
            return true
          }
          ).catch((err)=> {
            console.log(err)
            return false
          }
          )
        }
      }).catch((err)=> {
        console.log(err)
        return false
      })
    }
  }
} 