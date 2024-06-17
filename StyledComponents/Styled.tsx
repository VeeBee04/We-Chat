"use client";
import { Badge, Grid, InputLabel } from '@mui/material'
import { errorColor, label, labelSize, primary, subTitleSize, text, textSize, title, titleSize } from './Global';
import styled from '@emotion/styled'
import { motion } from 'framer-motion';
export const StyledGrid = styled(Grid)`
background:${primary};
min-height:100vh;
padding:0;
display:flex;
`
export const StyledTitle = styled.h1`
color:${title};
font-size: ${titleSize}
`
export const MotionStyledTitle = styled(motion.div)`
color:${title};
font-size: ${titleSize}
`
export const StyledSubTitle = styled.h2`
color:${text};
font-size: ${subTitleSize};

`
export const StyledText = styled.p`
font-size: ${textSize};
`
export const ErrorSpan = styled.span`
color:${errorColor};
font-size:13px
`
export const StyleButton = styled.button`
background-color: ${text};
    border-radius: 8px;
    border-style: none;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    line-height: 20px;
    list-style: none;
    margin: 0;
    outline: none;
    padding: 10px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: color 100ms;
    vertical-align: baseline;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition:all 0.5s;
    &:hover {
        background-color: #fc7690;
        
      }

`
export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    // boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const StyledLabel = styled(InputLabel)`
font-size: ${labelSize};
color:${label};
`