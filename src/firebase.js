import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCsJ61xVCX6TLusTY3iissVjE35PTXqzp0",
    authDomain: "accelerate-parking.firebaseapp.com",
    projectId: "accelerate-parking",
    storageBucket: "accelerate-parking.appspot.com",
    messagingSenderId: "190379052868",
    appId: "1:190379052868:web:a897d7a3f5575334219111",
    measurementId: "G-1FHXN85TVL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };