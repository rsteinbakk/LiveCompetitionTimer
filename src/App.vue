<template>
  <div class="maincontainer">
    <div
      class="alert alert-light"
      role="alert"
      style="
        text-align: center;
        font-size: 25px;
        font-weight: bold;
        width: 300px;
        margin-top: 6px;
      "
    >
      Svingetussa Challange
      <h5><a href="https://vtstisykling.no" target="_blank" style="color: grey; text-decoration: none;">www.vtstisykling.no</a></h5>
    </div>
    <!-- PUBLIC VIEW -->

    <!-- LOGGED IN ADMIN VIEW -->
    <NewRecord :loggedin="loggedIn" />
    <div
      class="container black"
      :class="{ red: nameDurationDb.name !== '' }"
      style="width: 90%"
      v-if="!loggedIn"
    >
      <h2 style="opacity: 80%; letter-spacing: 3px; text-align: center">LIVE</h2>
      <div class="">
        <h1
          style="font-weight: bold; letter-spacing: 1px; text-align: center"
          v-if="nameDurationDb.name !== ''"
        >
          {{ nameDurationDb.name }}
        </h1>
        <!-- , {{ newPerson.ageclass }} -->
        <h5 style="text-align: center" v-else>
          Ventar på klargjering av deltakar frå administrator.
        </h5>
      </div>
      <h2>{{ nameDurationDb.liveDuration }} <small>sek</small></h2>
    </div>
    <p></p>
    <div class="container" v-if="!loggedIn">
      <h2>Live Resultatliste:</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Namn</th>
            <th scope="col">Klasse</th>
            <th scope="col">Sekunder</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(competitor, index) in competitorsDb" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              {{ competitor.name }}
              <span v-if="index === 0"> 🥇 🔥</span>
              <span v-if="index === 1"> 🥈</span>
              <span v-if="index === 2"> 🥉</span>
            </td>
            <td>{{ competitor.ageclass }}</td>
            <td>{{ competitor.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p></p>
    <button
      @click="showLogin = !showLogin"
      class="btn btn-white"
      style="opacity: 0.3; margin-top: 20px; width: 100%"
    >
      <small># #</small>
    </button>

    <div
      v-if="showLogin && !loggedIn"
      style="display: flex; flex-direction: column; justify-content: center"
    >
      <p></p>
      <h5>Logg inn for å styre tidtaking</h5>
      <input
        type="email"
        placeholder="e-post"
        v-model="email"
        class="form-control"
      />
      <p></p>
      <input
        type="password"
        placeholder="passord"
        v-model="password"
        class="form-control"
      />
      <p></p>
      <button @click="signIn" class="btn btn-secondary">Logg inn</button>
      <p></p>
    </div>
    <div
      v-if="showLogin && loggedIn"
      style="display: flex; flex-direction: column; justify-content: center"
    >
      <br />
      <h5 v-if="loggedIn">Du er logget inn som administrator</h5>
      <button @click="signOut()" class="btn btn-danger">Logg ut</button>
      <p></p>
    </div>
  </div>
</template>

<script>
import NewRecord from "./components/NewRecord.vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
// import { getFirestore } from "firebase/firestore";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { collection, addDoc } from "firebase/firestore";
// import { doc, deleteDoc } from "firebase/firestore";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
// endring2 DSAADFS fdaadsfdfas

export default {
  name: "App",
  components: {
    NewRecord,
  },
  data() {
    return {
      loggedIn: false,
      showLogin: true,
      competitorsDb: [
        { name: "Ventar på fyste deltakar", ageclass: "10 år", time: 30.5 },
      ],
      nameDurationDb: { liveDuration: 0, name: "" },
      email: undefined,
      password: undefined,
    };
  },
  methods: {
    deleteIndex(index) {
      if (confirm("Sikker på du vil slette?")) {
        this.emittedCompetitors.splice(index, 1);
        this.updatedCompetitors = this.emittedCompetitors;

        const db = getDatabase();
        set(ref(db, "competitors/"), this.updatedCompetitors);
      }
    },
    signIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user + "Signed In");
          this.loggedIn = true;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    },
    signInPublic() {
      const auth = getAuth();
      console.log(auth.uid);

      this.getFromPublicDb();

      // onAuthStateChanged(auth, (user) => {
      //   if (user) {
      //     const uid = user.uid;
      //     console.log(uid + "er logget inn");
      //     this.loggedIn = true;
      //   } else {
      //     this.loggedIn = false;
      //   }
      // });
    },
    signOut() {
      const auth = getAuth();
      auth.signOut();
    },
    checkAuthState() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          if (uid === "bwBFfLMUPfckKW70JZNr4kY9Ngl1") {
            this.loggedIn = true;
            console.log("admin logged in");
          }
        } else {
          this.loggedIn = false;
        }
      });
    },
    // sendRealTimeToDb(bool) {
    //   let startDuration = undefined;
    //   const db = getDatabase();
    //   if (bool === true) {
    //     startDuration = setInterval(() => {
    //       set(ref(db, "duration/"), {
    //         name: this.currentPerson,
    //         liveDuration: this.realTime,
    //       });
    //     }, 1000);
    //   } else {
    //     if (startDuration !== undefined) startDuration.clearInterval();
    //   }
    // },
    getFromPublicDb() {
      const db = getDatabase();
      const durRef = ref(db, "duration/");
      onValue(durRef, (snapshot) => {
        const data = snapshot.val();
        this.nameDurationDb = data;
        // console.log(data);
      });
      const compRef = ref(db, "competitors/");
      onValue(compRef, (snapshot) => {
        const data = snapshot.val();
        this.competitorsDb = data;
        // console.log(data);
      });
    },
  },
  created() {
    this.checkAuthState();
    // signInWithEmailAndPassword(getAuth(), "public@public.no", "public");
    this.signInPublic();
  },
};
</script>

<style>
html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 96vw;
  display: flex;
  justify-content: center;
}
.maincontainer {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.black {
  border-radius: 10px;
  /* background-color: rgb(122, 122, 122); */
  color: rgb(216, 216, 216);
  padding: 30px;
  background: linear-gradient(10deg, #1bd990, #096900);
  background-size: 400% 400%;

  -webkit-animation: AnimationName 4s ease infinite;
  -moz-animation: AnimationName 4s ease infinite;
  animation: AnimationName 4s ease infinite;
}
.red {
  background: linear-gradient(10deg, #d91b22, #ccb329);
  background-size: 400% 400%;

  -webkit-animation: AnimationName 4s ease infinite;
  -moz-animation: AnimationName 4s ease infinite;
  animation: AnimationName 4s ease infinite;
}

@-webkit-keyframes AnimationName {
  0% {
    background-position: 64% 0%;
  }
  50% {
    background-position: 37% 100%;
  }
  100% {
    background-position: 64% 0%;
  }
}
@-moz-keyframes AnimationName {
  0% {
    background-position: 64% 0%;
  }
  50% {
    background-position: 37% 100%;
  }
  100% {
    background-position: 64% 0%;
  }
}
@keyframes AnimationName {
  0% {
    background-position: 64% 0%;
  }
  50% {
    background-position: 37% 100%;
  }
  100% {
    background-position: 64% 0%;
  }
}
</style>
