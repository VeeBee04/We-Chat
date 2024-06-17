"use client";
import React, { createContext, useState, useContext, ReactNode,useEffect} from 'react';
import { fetchGroupDetails } from '../Controllers/Controller';


interface ChatProviderProps {
  children: ReactNode;
}
interface ChatContextType {
    friendsArr: string[];
    setFriends: React.Dispatch<React.SetStateAction<string[]>>;
    friendCount: number;
    setFriendCount: React.Dispatch<React.SetStateAction<number>>;
    blockedUsers: string[];
    setBlockedUsers: React.Dispatch<React.SetStateAction<string[]>>;
    isBlockedByArr: string[];
    setIsBlockedBy: React.Dispatch<React.SetStateAction<string[]>>;
    groups: string[];
    setGroups: React.Dispatch<React.SetStateAction<string[]>>;
    createGroup:boolean;
    setCreateGroup:React.Dispatch<React.SetStateAction<boolean>>;
    groupId:string;
    setGroupId:React.Dispatch<React.SetStateAction<string>>;
    members:string[];
    addMembers:React.Dispatch<React.SetStateAction<string[]>>;
    gAdmin:string;
    setAdmin:React.Dispatch<React.SetStateAction<string>>;
    gDp:string | null;
    setGDp:React.Dispatch<React.SetStateAction<string | null>>;
    gName:string;
    setGName:React.Dispatch<React.SetStateAction<string>>;
    gCreatedAt:string;
    setCreatedAt:React.Dispatch<React.SetStateAction<string>>;
  }

  const ChatContext = createContext<ChatContextType>({
    friendsArr: [],
    setFriends: () => {},
    friendCount: 0,
    setFriendCount:()=>{},
    blockedUsers:[],
    setBlockedUsers:()=>{},
    isBlockedByArr:[],
    setIsBlockedBy:()=>{},
    groups:[],
    setGroups:()=>{},
    createGroup:false,
    setCreateGroup:()=>{},
    groupId:"",
    setGroupId:()=>{},
    members:[],
    addMembers:()=>{},  
    gAdmin:"",
    setAdmin:()=>{},
    gDp:null,
    setGDp:()=>{},
    gName:"",
    setGName:()=>{},
    gCreatedAt:"",
    setCreatedAt:()=>{}
  });

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [friendsArr,setFriends] = useState<string[]>([])
  const [groups,setGroups] = useState<string[]>([])
  const [createGroup,setCreateGroup] = useState<boolean>(false)
  const [friendCount,setFriendCount] = useState(0)  
  const [blockedUsers,setBlockedUsers] = useState<string[]>([]) // blocked by me
  const [isBlockedByArr,setIsBlockedBy] = useState<string[]>([])
  const [groupId,setGroupId] = useState<string>("")
  const [members,addMembers] = useState<string[]>([])
  const [gAdmin,setAdmin] = useState<string>("")
  const [gDp,setGDp] = useState<string | null>(null)
  const [gName,setGName] = useState("")
  const [gCreatedAt,setCreatedAt] = useState("")
    useEffect(()=>{
      const groupDetails = async()=> {

          if(groupId) {
            const res = await fetchGroupDetails(groupId)
            if(res) {
              const {members,name,groupDp,admin,createdAt} = res
             addMembers(members)
              setGName(name)
              setGDp(groupDp)
              setCreatedAt(createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
              setAdmin(admin)
            }
          }
      }
      groupDetails()
  },[groupId])


  return <ChatContext.Provider value={{friendsArr,setFriends,friendCount,setFriendCount,blockedUsers,setBlockedUsers,isBlockedByArr,setIsBlockedBy,groups,setGroups,createGroup,setCreateGroup,groupId,setGroupId,addMembers,gDp,gAdmin,gCreatedAt,members,gName,setAdmin,setCreatedAt,setGDp,setGName}}>{children}</ChatContext.Provider>;

};
