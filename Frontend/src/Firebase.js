import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCyOK8yXeC6Fg_PU-SINJZp2rmftZ8W5gU",
    authDomain: "movie-night-2bb00.firebaseapp.com",
    projectId: "movie-night-2bb00",
    storageBucket: "movie-night-2bb00.appspot.com", // fixed .app to .appspot.com
    messagingSenderId: "515954843478",
    appId: "1:515954843478:web:7c5416bc066194df39c0f7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
