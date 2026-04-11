import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYjPQZOKjMNH3rmH4QYYakeMZmXVmtaUM",
  authDomain: "nriit-9dfb1.firebaseapp.com",
  projectId: "nriit-9dfb1",
  storageBucket: "nriit-9dfb1.firebasestorage.app",
  messagingSenderId: "871675525723",
  appId: "1:871675525723:web:a149fe83eaf3f6d1bb1d7e",
  measurementId: "G-FQRKQPDWXS",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
