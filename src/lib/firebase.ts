// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6zmMM4qIRgOp-nzXo5HmEJ3oDp59qFV0",
  authDomain: "meetpro-37b81.firebaseapp.com",
  projectId: "meetpro-37b81",
  storageBucket: "meetpro-37b81.firebasestorage.app",
  messagingSenderId: "463517229286",
  appId: "1:463517229286:web:719a9ec07310981dcf5b27",
  measurementId: "G-B7RTPLS2PY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// const analytics = getAnalytics(app);