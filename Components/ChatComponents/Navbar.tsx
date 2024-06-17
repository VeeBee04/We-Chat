import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { primary } from '../../StyledComponents/Global';
import { useSearchParams } from "next/navigation";
import { Avatar } from '@mui/material';
import { socket } from '../../socket';
type Props ={
  setOpenFProfile:React.Dispatch<React.SetStateAction<boolean>>;
  friendId:string;
}
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar({setOpenFProfile,friendId}:Props) {
  const searchParams = useSearchParams()
  const [typing, isTyping] = React.useState(false)
  React.useEffect(()=> {
    console.log(typing)
  },[typing])
  React.useEffect(()=>{
    socket.on("typing",(data:any)=> {
      console.log("typing",data)
      if(data.msgSentBy===friendId){
      isTyping(true)
    }
    })
    socket.on("not_typing",(data)=> {
      if(data.msgSentBy===friendId) isTyping(false)
    })
    return ()=> {
      socket.off("typing")
      socket.off("notTyping")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:"#0d285b"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <ArrowDownwardIcon />
          </IconButton>
          <Avatar src={searchParams.get("fDp") || "/logo.png"} onClick={()=>setOpenFProfile(prev=>!prev)} sx={{marginRight:"10px",cursor:"pointer"}}/>
          <Box sx={{display:"flex",flexDirection:"column",flex:1}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block',color:primary } }}
          >
            {searchParams.get("fFirstName")!==null?searchParams.get("fFirstName")+" "+searchParams.get("fLastName"):"We Chat"}
          </Typography>
          <Typography
          variant='body2'
          noWrap
          component={"div"}
          sx={{display:typing?"block":"none"}}>
            Typing...
          </Typography>
          </Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}