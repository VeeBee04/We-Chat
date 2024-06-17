import React, { useCallback, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { StyleButton } from '../../StyledComponents/Styled';
type Props = {
    setImgSrc:React.Dispatch<React.SetStateAction<string>>;
    imgSrc:string
}
const MyWebCam = ({setImgSrc,imgSrc}:Props) => {
    const ref = useRef<Webcam>(null);
    const capture = useCallback(() => {
        const src = ref.current?.getScreenshot();
        src &&
        setImgSrc(src);
        // console.log(src)
      }, [ref,setImgSrc]);
      useEffect(()=> {
        console.log(imgSrc)
      },[imgSrc])
  return (
    <>
    <Webcam ref={ref} screenshotFormat="image/jpeg" mirrored={true} screenshotQuality={1}/>
    <StyleButton onClick={capture}>Capture</StyleButton>
    
    
    </>
  )
}

export default MyWebCam