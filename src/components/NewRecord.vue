<template>
  <!-- <div v-if="newPerson !== undefined" class="alert alert-primary bikeman">
      {{ newPerson.name }}, {{ newPerson.ageclass }}
    </div> -->
  <!-- <div v-else class="alert alert-secondary bikeman">
      Ventar på deltakarregistrering frå administrator
    </div> -->
  <!-- <div class="watchcon">
      <h1 class="secspan">{{ duration }}</h1>
    </div> -->
  <!-- <br /> -->
  <div v-if="loggedin" style="max-width: 800px">
    <section
      v-if="!personReady"
      style="display: grid; grid-template-columns: 1fr 1fr; width: 100%"
    >
      <button @click="getReady()" class="btn btn-primary" v-if="!personReady">
        Legg til deltakar
      </button>

      <button class="btn btn-secondary" disabled>START</button>
      <button class="btn btn-secondary" disabled>STOPP</button>
      <!-- <button class="btn btn-secondary" disabled>NY DELTAKAR</button> -->
      <button class="btn btn-secondary" disabled>TILBAKESTILL</button>
    </section>
    <section
      v-else
      style="display: grid; grid-template-columns: 1fr 1fr; width: 100%"
    >
      <button @click="start()" class="btn btn-success" v-if="!isRunning">
        START
      </button>
      <button
        @click="start()"
        class="btn btn-success"
        v-else-if="isRunning && isStopped"
      >
        START PÅ NYTT
      </button>
      <button class="btn btn-secondary" disabled v-else>START</button>
      <button
        @click="stop()"
        class="btn btn-danger"
        v-if="isRunning && !isStopped"
      >
        STOPP
      </button>
      <button @click="stop()" class="btn btn-secondary" disabled v-else>
        STOPP
      </button>
      <button
        @click="saveNewPersonAndTime()"
        class="btn btn-primary"
        v-if="isStopped"
      >
        LAGRE
      </button>
      <button
        @click="saveNewPersonAndTime()"
        class="btn btn-secondary"
        disabled
        v-else
      >
        LAGRE
      </button>
      <!-- <button @click="reset()" class="btn btn-warning">NY DELTAKAR</button
        > -->
      <button class="btn btn-warning" @click="reset('new')">
        TILBAKESTILL
      </button>
      <!-- <button class="btn btn-secondary" disabled>Legg til deltakar</button
        > -->
    </section>

    <!-- VISNINGSSEKSJON -->
    <!-- :class="{ red: newPerson.name !== ''  }" -->
    <div class="container black" style="width: 90%">
      <h2 style="opacity: 80%; letter-spacing: 3px">LIVE TIDTAKING</h2>
      <div class="">
        <h1 style="font-weight: bold; letter-spacing: 1px" v-if="newPerson">
          {{ newPerson.name }}
        </h1>
        <!-- , {{ newPerson.ageclass }} -->
        <h5 style="text-align: center" v-else>
          Ventar på klargjering av deltakar frå administrator.
        </h5>
      </div>
      <h2>{{ duration }} <small>sek</small></h2>
    </div>

    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
      "
    >
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
          <tr v-for="(competitor, index) in competitors" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <span
                v-if="loggedin"
                @click="deleteIndex(index)"
                style="cursor: pointer"
              >
                {{ competitor.name }}</span
              ><span v-else> {{ competitor.name }}</span
              ><span v-if="index === 0"> 🥇 🔥</span>
              <span v-if="index === 1"> 🥈</span>
              <span v-if="index === 2"> 🥉</span>
            </td>
            <td>{{ competitor.ageclass }}</td>
            <td>{{ competitor.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <button @click="reset()" class="btn btn-info">LAGRE TID PÅ PERSON</button
      > --><vue-notification-list
    ></vue-notification-list>
  </div>
</template>

<script>
import "@dafcoe/vue-notification/dist/vue-notification.css";
import { StopWatch } from "../StopWatch.js";
import { VueNotificationList } from "@dafcoe/vue-notification";
import { useNotificationStore } from "@dafcoe/vue-notification";
import { getDatabase, ref, set, onValue, query, orderByChild } from "firebase/database";

const { setNotification } = useNotificationStore();
// import { useNotificationStore } from '@dafcoe/vue-notification/vue-notification.store'

// import { getFirestore } from "firebase/firestore";
// import { collection, addDoc } from "firebase/firestore";
export default {
  props: ["updatedCompetitors", "loggedin"],
  components: {
    VueNotificationList,
  },
  data() {
    return {
      stopwatch: new StopWatch(),
      duration: 0,
      durationInterval: undefined,
      newPerson: { name: "", ageclass: "", time: 0 },
      personReady: false,
      isRunning: false,
      isStopped: false,
      competitors: [
        { name: "Ventar på database", ageclass: "10+", time: 30.5 },
        // { name: "Roger Steinbakk", ageclass: "30+", time: 30.5 },
        // { name: "Roger Steinbakk", ageclass: "40+", time: 30.5 },
      ],
    };
  },
  methods: {
    getDb() {
      const db = getDatabase();
      const compRef = ref(db, "competitors/");
      // value(compRef, (snapshot) => {
      //   const data = snapshot.val();
      //  console.log(data);
      // })
      // .then(() => {
      // this.$emit("competitors", this.competitors);
      // console.log("Got info");
      // })
      // .catch(() => {
      // The write failed...
      // });

      onValue(compRef, (snapshot) => {
        const data = snapshot.val();
        this.competitors = data;
      });
    },
    deleteIndex(index) {
      if (confirm("Sikker på du vil slette?")) {
        this.competitors.splice(index, 1);

        const db = getDatabase();
        set(ref(db, "competitors/"), this.competitors);
      }
    },
    writeDb() {
      const db = getDatabase();
      set(ref(db, "competitors/"), this.competitors);

      // SORTING IN DB
      query(ref(db, "competitors/"), orderByChild("time"));
    },
    getReady() {
      let name = prompt("Fullt navn på deltakar");
      if (name === null) {
        return;
      } else if (name.length < 3) {
        return;
      } else {
        let age = prompt("Hvor mange år er deltakaren? (skriv tal)");
        age = this.checkAge(age);
        this.newPerson = {
          name: name,
          ageclass: age,
          time: "Ikkje registrert",
        };
        this.personReady = true;
        setNotification({
          message: "Lagt til: " + name + " - " + this.newPerson.ageclass,
          type: "success",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          duration: 2000,
          showDurationProgress: false,
          appearance: "light",
        });
        this.$emit("currentPerson", this.newPerson.name);
      }
    },
    checkAge(age) {
      if (6 > age) {
        return "0-6 år";
      } else if (age >= 6 && age <= 9) {
        return "6-9 år";
      } else if (age >= 10 && age <= 12) {
        return "10-12 år";
      } else if (age >= 13 && age <= 15) {
        return "13-15 år";
      } else if (age >= 16 && age <= 19) {
        return "16-19 år";
      } else if (age >= 20 && age <= 39) {
        return "20-40 år";
      } else if (age >= 40 && age <= 99) {
        return "40+";
      }
    },
    start() {
      this.isStopped = false;
      this.stopwatch.start();
      this.isRunning = true;
      this.startDurationInterval();
    },
    startDurationInterval() {
      this.durationInterval = setInterval(this.showDuration, 25);
      this.sendRealTimeToDb(true);
    },
    showDuration() {
      this.duration = this.stopwatch.duration;
    },
    sendRealTimeToDb(bool) {
      let startDuration = undefined;
      const db = getDatabase();
      if (bool === true) {
        startDuration = setInterval(() => {
          if (this.newPerson !== undefined)
            set(ref(db, "duration/"), {
              name: this.newPerson.name,
              liveDuration: this.duration,
            });
        }, 1000);
      } else {
        if (startDuration !== undefined) startDuration.clearInterval();
      }
    },
    stop() {
      this.isStopped = true;
      this.isRunning = false;
      this.stopwatch.stop();
      clearInterval(this.durationInterval);
      this.sendRealTimeToDb(false);
      this.duration = this.stopwatch.endduration;
      this.newPerson.time = this.duration;
    },

    reset() {
      this.stopwatch.reset();
      this.duration = 0;
      this.newPerson = undefined;
      this.personReady = false;
    },
    saveNewPersonAndTime() {
      if (this.duration < 0) {
        alert(
          "Kan det være en feil? Det er registrert tid på under 5 sekunder"
        );
        return;
      } else {
        if (confirm("Sikker på at du vil lagre til database?")) {
          this.competitors.push(this.newPerson);
          // if (this.competitors.length <= 2) {
            // SORTING LOCALLY
            this.competitors.sort(
              (a, b) => parseFloat(a.time) - parseFloat(b.time)
            );
          // }
          this.reset();
          this.isStopped = false;
          this.writeDb();
        } else {
          return;
        }
      }
    },
  },
  created() {
    this.getDb();
    // this.writeDb();
  },
};
</script>

<style scoped>
.bikeman {
  padding: 10px 15px;
  font-size: 18px;
}
button {
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 10px;
  /* padding: 10px; */
}
h1 {
  font-weight: 500;
}
.disabled {
  background-color: rgb(168, 168, 168);
}
.container {
  background-color: rgba(235, 235, 235, 0.829);
  margin-top: 30px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
.watchcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  background-color: rgb(0, 0, 0);
  border-radius: 10px;
  color: gainsboro;
}
.secspan {
  font-size: 3rem;
}
.start {
  background-color: rgb(41, 148, 41);
}
</style>
