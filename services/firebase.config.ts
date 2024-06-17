// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS6Fhch9pIdprG05DSp6Jej64tw2CTPXE",
  authDomain: "we-chat-fa031.firebaseapp.com",
  projectId: "we-chat-fa031",
  storageBucket: "we-chat-fa031.appspot.com",
  messagingSenderId: "958277323546",
  appId: "1:958277323546:web:e987756a8c642b1b44faa3",
  measurementId: "G-D8BZ6GGCN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
auth.languageCode = 'en';
export const provider = new GoogleAuthProvider();
export const bucket = getStorage(app)
export default app
