// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-243e1.firebaseapp.com",
  projectId: "real-estate-243e1",
  storageBucket: "real-estate-243e1.appspot.com",
  messagingSenderId: "738662563126",
  appId: "1:738662563126:web:69d8ab81f122d668e80797"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
