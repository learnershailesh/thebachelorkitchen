// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyAfACyAvOD63g8MrM_OH-YsdlG8z-Uecps",
//     authDomain: "thebachelorskitchens-auth.firebaseapp.com",
//     projectId: "thebachelorskitchens-auth",
//     storageBucket: "thebachelorskitchens-auth.appspot.com",
//     messagingSenderId: "308399564628",
//     appId: "1:308399564628:web:dde58c9cf566f8f9fc8ac1",
// };

// // IMPORTANT: only ONE app instance
// const app = initializeApp(firebaseConfig);



// export const auth = getAuth(app);

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAfACyAvOD63g8MrM_OH-YsdlG8z-Uecps",
    authDomain: "thebachelorskitchens-auth.firebaseapp.com",
    projectId: "thebachelorskitchens-auth",
    storageBucket: "thebachelorskitchens-auth.firebasestorage.app",
    messagingSenderId: "308399564628",
    appId: "1:308399564628:web:dde58c9cf566f8f9fc8ac1",
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
