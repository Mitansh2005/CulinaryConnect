// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7WJcDRrOVKEfoe2hvfGwjTljhjS_JW4o",
  authDomain: "chef-web-8a2f2.firebaseapp.com",
  projectId: "chef-web-8a2f2",
  storageBucket: "chef-web-8a2f2.appspot.com",
  messagingSenderId: "909916564111",
  appId: "1:909916564111:web:6a929f1d0b21f846e35efa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
export {app,auth};