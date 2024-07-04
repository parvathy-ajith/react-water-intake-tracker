// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvQosHifOFNhsituKKyV8469e7APg-0Qg",
  authDomain: "water-intake-tracker-c8709.firebaseapp.com",
  projectId: "water-intake-tracker-c8709",
  storageBucket: "water-intake-tracker-c8709.appspot.com",
  messagingSenderId: "1090644987511",
  appId: "1:1090644987511:web:1ef4085e72b1946b47c072"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);