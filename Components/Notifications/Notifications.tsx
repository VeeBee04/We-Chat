import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { TFriendRequest } from '../../Types/user';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase.config";
import { useAuth } from "../../context/AuthContext";
import Notification from "./Notification";
import { StyledSubTitle } from "../../StyledComponents/Styled";
type Props = {
  openNotis: boolean;
  friendReqArr: TFriendRequest[];
  setOpenNotis: React.Dispatch<React.SetStateAction<boolean>>;
  setFriendReqArr: React.Dispatch<React.SetStateAction<TFriendRequest[]>>;
};
const Notifications = ({
  openNotis,
  friendReqArr,
  setOpenNotis,
  setFriendReqArr,
}: Props) => {
  const { uid } = useAuth();
  const variants = {
    openNotis: { opacity: 1, height: "70vh" },
    closed: { opacity: 0, height: "0vh" },
  };
  useEffect(() => {
    const getFriendRequests = async () => {
        if(openNotis) {

            const friendReqRef = doc(db, "friendRequests", uid);
            await getDoc(friendReqRef).then((doc) => {
              if (doc.exists()) {
                const data = doc.data()
                if (data) {
                  setFriendReqArr(data.requests);
                }
                console.log(data);
              }
            });
        }
    };
    getFriendRequests();
  }, [setFriendReqArr, uid,openNotis]);
  return (
    <>
      <motion.div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          
        }}
        variants={variants}
        initial="closed"
        animate={openNotis ? "openNotis" : "closed"}
        transition={{
          opacity: { delay: openNotis ? 0 : 0.3 },
          height: { duration: 0.3 },
        }}
      >
        <CloseIcon
          sx={{ position: "absolute", right: "20px", cursor: "pointer",top:"15px" }}
          onClick={() => setOpenNotis(false)}
        />
        <Box sx={{ mt: 3, height: "100%",padding:"24px" }}>
          {openNotis && friendReqArr.length !== 0
            ? friendReqArr.map((req, index) => {
                return <Notification key={req.uid} req={req}/>;
              })
            : <StyledSubTitle>No pending requests</StyledSubTitle>}
        </Box>
      </motion.div>
    </>
  );
};

export default Notifications;
