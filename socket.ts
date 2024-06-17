import { io } from 'socket.io-client';
export const socket = io('https://we-chat-backend-zdhq.onrender.com/',{
    autoConnect:false
})
// export const socket = io('http://localhost:80',{
//     autoConnect:false
// })