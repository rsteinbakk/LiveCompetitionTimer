// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDF-vjxbHfrfxJhU-FHx6GV9qsNIjcBtkY",

  authDomain: "rogsstopwatch.firebaseapp.com",

  databaseURL:
    "https://rogsstopwatch-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "rogsstopwatch",

  storageBucket: "rogsstopwatch.appspot.com",

  messagingSenderId: "727848192566",

  appId: "1:727848192566:web:b59e4faaea552a2e4ba697",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export default app;
