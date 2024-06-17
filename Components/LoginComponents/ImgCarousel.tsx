import Image from 'next/image'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
const items = [
    {
       src: "/call.svg",
       name: "call"
    },
    {
        src:"/chat.svg",
        name: "chat"
    },
    {
        src: "/video.svg",
        name: "video"
    }
]
const ImgCarousel = () => {
  return (
    <div style={{margin:"auto auto",width:"50%"}}>
      <Carousel IndicatorIcon={false} PrevIcon={false} NextIcon={false}>
            {
                items.map( (item, i) => <Item key={i} src={item.src} name={item.name}/> )
            }
        </Carousel>
    </div>
  )
}

export default ImgCarousel
function Item(props: { src: string; name: string; })
{
    return (
       <Image src={props.src} alt = {props.name} width={500} height={500}/>
    )
}
