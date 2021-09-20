import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import VueNotificationList from "@dafcoe/vue-notification";

// Import the functions you need from the SDKs you need

// import { initializeApp } from "firebase/app"; <-- UNCOMMENT THIS

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration <--- REMEMBER



// Initialize Firebase

// export const app = initializeApp(firebaseConfig); <-- UNCOMMENT THIS


createApp(App)
  .use(VueNotificationList)
  .mount("#app");
