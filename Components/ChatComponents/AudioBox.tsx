import { Box, Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import WaveSurfer from 'wavesurfer.js'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { primary, text } from '../../StyledComponents/Global';
type Props = {
    audioUrl:string,
    id:string
}
const AudioBox = ({audioUrl,id}:Props) => {
   
    const [isPlay,setIsPlay] = useState(false)
    const waveformRef = useRef<WaveSurfer | null>(null);
    const reactPlayerRef = useRef<ReactPlayer | null>(null);
    useEffect(() => {
        if (audioUrl) {
          if (waveformRef.current) {
            waveformRef.current.destroy();
        }
      
          const wavesurfer = WaveSurfer.create({
            container: `#${id}`,
            waveColor: text,
            progressColor: primary,
            height:40,
            cursorWidth:2,
            cursorColor:text,
            url:audioUrl
          });
      
          waveformRef.current = wavesurfer;
          waveformRef.current.on('finish', () => {
            setIsPlay(false);
            waveformRef.current?.stop();
            waveformRef.current?.seekTo(0);
          });
        }
      }, [audioUrl, id]);
        useEffect(() => {
            waveformRef.current?.on('audioprocess', (progress: number) => {
              if (waveformRef.current) {
                reactPlayerRef.current?.seekTo(progress / waveformRef.current.getDuration());
              }

            });
          }, [waveformRef, reactPlayerRef]);
          const handlePlay = () => {
            if (waveformRef.current && !isPlay) {
              waveformRef.current.play();
            }
            else {
                waveformRef.current?.pause()
            }
            setIsPlay(!isPlay)
          }
  return (
    <Box sx={{display:"flex", alignItems:"center",gap:"10px",padding:"20px",border:"1px dashed"}}>
        <Box id={id} sx={{width:"200px"}}>
            
            </Box>
            <Button onClick={() => handlePlay()} sx={{borderRadius:"50%",width:"35px",height:"35px",minWidth:"unset"}}>{isPlay?<PauseIcon/>:<PlayArrowIcon/>} </Button>
            </Box>
  )
}

export default AudioBox