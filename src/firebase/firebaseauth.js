// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqU_eVuDQuJQscwcT-LlNPeFeRHBqteb8",
  authDomain: "saywell-28930.firebaseapp.com",
  projectId: "saywell-28930",
  storageBucket: "saywell-28930.appspot.com",
  messagingSenderId: "144931137875",
  appId: "1:144931137875:web:a560e98d89170b02c959a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized with config:', firebaseConfig);
}

export default app;