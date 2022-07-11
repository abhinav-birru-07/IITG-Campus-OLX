// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuDEuUeaZqt0absbztCgwc8Hc_nAy0XDg",
  authDomain: "olx-iitg-new.firebaseapp.com",
  projectId: "olx-iitg-new",
  storageBucket: "olx-iitg-new.appspot.com",
  messagingSenderId: "798583463100",
  appId: "1:798583463100:web:326146f11571ec8f1a84b9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
