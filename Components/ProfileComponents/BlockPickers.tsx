import { Grid } from '@mui/material'
import React from 'react'
import { StyledLabel } from '../../StyledComponents/Styled'
import { BlockPicker } from 'react-color'
type Props = {
    color:string,
    setColor:(color: string) => void;
    Colors:string[],
    type:string

}
const BlockPickers = ({color,setColor,Colors,type}:Props) => {
  return (
    <Grid xs={8} sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>

    <StyledLabel sx={{pb:2}}>{type} Messages</StyledLabel>
    <BlockPicker 
    color={color}
    colors={Colors}
    onChangeComplete={(color)=>setColor(color.hex)}
    />
        </Grid>
  )
}

export default BlockPickers