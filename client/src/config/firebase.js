import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// These should ideally be in a .env file
const firebaseConfig = {
    apiKey: window._env_?.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: window._env_?.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
    projectId: window._env_?.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: window._env_?.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
    messagingSenderId: window._env_?.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: window._env_?.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



