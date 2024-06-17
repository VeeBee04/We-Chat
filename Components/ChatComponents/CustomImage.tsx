import Image from 'next/image'
import React, {useRef } from 'react'
type Props = {
    src:string;


}
const CustomImage = ({src}:Props) => {
    const [imageSize, setImageSize] = React.useState(100);
    const ref = useRef<HTMLImageElement>(null);

  return (
   
   <Image src={src} alt="media" ref={ref} width={imageSize} height={imageSize} onMouseEnter={()=>setImageSize(200)} onMouseLeave={()=>setImageSize(100)} style={{transition:"all 0.4s"}}/>
   
  )
}

export default CustomImage