import React from 'react'
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TAuthUser } from '../../Types/user';

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    searchVal:null | string,
    setSearchVal: React.Dispatch<React.SetStateAction<null | string>>;
    placeholder?:string,
    setSearchContactArr?: React.Dispatch<React.SetStateAction<TAuthUser[]>>;
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

const SearchBar = ({setOpen,searchVal,setSearchVal,placeholder,setSearchContactArr}:Props) => {
  const handleSearchDelete = ()=> {
    setSearchVal("")

    setSearchContactArr && setSearchContactArr([])
  }
  return (
    <>
    <Box sx={{mt:2,width:"60%"}} >
        <Search sx={{position:'relative',border: "1px solid black",borderRadius: "10px",marginRight: "10px",maxWidth: "100%", display: 'flex', justifyContent: 'space-between'}} >
            <SearchIconWrapper>
              <SearchIcon sx={{cursor:'pointer'}}/>
            </SearchIconWrapper>
            <StyledInputBase
              onFocus={() => setOpen(true)}

              placeholder={placeholder || "Search…"}
              inputProps={{ 'aria-label': 'search' }}
              
              value={searchVal || ''}
              onChange={(e)=>setSearchVal(e.target.value)}
            />
          <SearchIconWrapper sx={{position: "absolute",right: "0px",cursor:'pointer',zIndex:10}} onClick={handleSearchDelete}>
          {searchVal && searchVal.length > 0 ? <CloseIcon sx={{fontSize:"17px"}}/> : null}
            </SearchIconWrapper>
        </Search>
      </Box>
    </>
  )
}

export default SearchBar