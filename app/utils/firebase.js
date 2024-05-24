import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDy7rqk8Wy7oBDlSeDizZq1nSmfEMl3taU",
    authDomain: "projectiiotca2-default-rtdb.firebaseapp.com",
    databaseURL: "https://projectiiotca2-default-rtdb.firebaseio.com/",
    projectId: "projectiiotca2",
    storageBucket: "projectiiotca2-default-rtdb.appspot.com/",
    messagingSenderId: "your-messaging-sender-id",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
