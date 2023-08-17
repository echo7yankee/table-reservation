import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDcsMeuwCqDhL6OlPEgLHag9R-zSymb7JA",
    authDomain: "echo-firestore-cafe.firebaseapp.com",
    databaseURL: "https://echo-firestore-cafe.firebaseio.com",
    projectId: "echo-firestore-cafe",
    storageBucket: "echo-firestore-cafe.appspot.com",
    messagingSenderId: "757391324909",
    appId: "1:757391324909:web:04021ae1876a394d7e7ee4",
};

const app = initializeApp(firebaseConfig);
export const authentification = getAuth(app);
