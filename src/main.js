import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import VueNotificationList from "@dafcoe/vue-notification";

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

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

export const app = initializeApp(firebaseConfig);


createApp(App)
  .use(VueNotificationList)
  .mount("#app");
