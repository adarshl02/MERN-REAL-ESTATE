// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-17963.firebaseapp.com",
  projectId: "mern-estate-17963",
  storageBucket: "mern-estate-17963.appspot.com",
  messagingSenderId: "379536300588",
  appId: "1:379536300588:web:f69e9b417d74a127af8f89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);