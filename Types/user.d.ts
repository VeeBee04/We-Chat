import { Timestamp } from "firebase/firestore";
import React from "react";

// import { serverTimestamp } from 'firebase/firestore';
export type TAuthData = {
    accessToken: string;
    displayName: string,
    photoUrl: string,
    email: string,
    phone?: string
}
export type TAuthUser = {
    email: string ;
    firstName: string ;
    lastName: string ;
    photoURL: string ;
    uid: string ;
    phone: string ;
    dob:string ;
    timestamp: Date;
    bio:string;
    gender:string;
    uid:string;
    isBlocked:boolean;
    groups: Array<string>;
  };
  export type TFriendRequest = {
    requests: [
        {
            firstName: "string",
            lastName: "string",
            photoURL: "string",
            timestamp: "string",
            uid: "string",
        }
    ],
    uid: "string",
  }
  export type TContact = {
    firstName:string;
    lastName:string;
    photoURL:string;
    uid:string;
    bio:string;
    dob:string;
    email:string
    gender:string;
    phone:string;
  }
  export type TChatType = {
    from: string;
    content: string;
    type: string;
    timestamp: Timestamp;
    contact?:TContact;
  }
  export type TTypesOfChat = {
    setType:React.Dispatch<React.SetStateAction<string>>;
    docRef:any|null;
    uid:string;
    setMessages:React.Dispatch<React.SetStateAction<TChatType[]|null>>;
    friendId:string;
    setDocRef:React.Dispatch<React.SetStateAction<any|null>>;
    refer:React.RefObject<HTMLDivElement>;
  }
  export type TFriendsType = {
    count:number;
    friendsArr:string[];
    user:string;
  }
  export type TGroupType = {
    name:string;
    members:string[];
    admin:string;
    groupDp:string;
    createdAt:Timestamp;
  }