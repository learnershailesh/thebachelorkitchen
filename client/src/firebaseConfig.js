import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your project's Firebase config
// const firebaseConfig = {
//     apiKey: "AIzaSyB0JEv2JHn575Mx61adNAu1S2G3eWepWQw",
//     authDomain: "thebachelorskitchens-4415b.firebaseapp.com",
//     projectId: "thebachelorskitchens-4415b",
//     storageBucket: "thebachelorskitchens-4415b.firebasestorage.app",
//     messagingSenderId: "1033346689606",
//     appId: "1:1033346689606:web:57aac9691b23bfdd747847"
// };

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
