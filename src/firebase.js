import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7QZlCuWfmqWUtsQY8Gi9dLm95ijKZaDM",
  authDomain: "dwacra-tracker.firebaseapp.com",
  projectId: "dwacra-tracker",
  storageBucket: "dwacra-tracker.firebasestorage.app",
  messagingSenderId: "423023947798",
  appId: "1:423023947798:web:6c50a0fcb91d088919c537",
  measurementId: "G-4BR0SB0E2V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
