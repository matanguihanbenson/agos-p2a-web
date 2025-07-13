// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add your Firebase configuration
// Replace this with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAVtqDT-qoLscm_SIozlrYwpO87KdWdUZI",
  authDomain: "p2a-hackathon.firebaseapp.com",
  databaseURL: "https://p2a-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "p2a-hackathon",
  storageBucket: "p2a-hackathon.firebasestorage.app",
  messagingSenderId: "1075675221951",
  appId: "1:1075675221951:web:7d49ce764970065ac45b0a",
  measurementId: "G-BKLMC9QYXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
