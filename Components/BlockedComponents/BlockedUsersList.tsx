import { Box, Button } from "@mui/material";
import React from "react";
import { StyledSubTitle } from "../../StyledComponents/Styled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChat } from "../../context/ChatContext";
import BlockedUser from "./BlockedUser";
type Props = {
  setShowBlockedUsers: React.Dispatch<React.SetStateAction<boolean>>;
};
const BlockedUsersList = ({ setShowBlockedUsers }: Props) => {
  const {blockedUsers} = useChat()
  return (
    <Box
      sx={{
        width: "50%",
        height: "75%",
        backgroundColor: "white",
        margin: "auto auto",
        borderRadius: "39px 39px 5px 5px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "14px",
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Button
          color="secondary"
          sx={{ width: "fit-content", fontSize: "12px" }}
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowBlockedUsers(false)}
        >
          Back to Profile
        </Button>
        {blockedUsers.length>0 && <Box sx={{ display: "flex", justifyContent: "center" }}>
          <StyledSubTitle style={{ margin: 0 }}>Blocked Users</StyledSubTitle>
        </Box>
}
        {
          blockedUsers.length >0 ?
          blockedUsers.map((user,index)=> {
            return <BlockedUser key={user} blockedId = {user}/>
          }):
          <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}>
            <StyledSubTitle style={{margin:0}}>No Blocked Users</StyledSubTitle>
          </Box>

        }
      </Box>
    </Box>
  );
};

export default BlockedUsersList;
