export class StopWatch {
  constructor() {
    this._startTime = null;
    this._endTime = null;
    this._duration = 0;
    this._started = false;
  }
  start() {
    if (!this._started) {
      this._started = true;
      this._startTime = Date.now();
    } else {
      throw new Error("Cannot call start. Stopwatch has already started.");
    }
  }

  stop() {
    if (this._started) {
      this._started = false;
      this._endTime = Date.now();
      this._duration = this._endTime - this._startTime;
    } else {
      throw new Error("Cannot call stop. Stopwatch has not been started.");
    }
  }

  reset() {
    this._startTime = null;
    this._endTime = null;
    this._duration = 0;
  }

  get duration() {
    this._calcSec = (Date.now() - this._startTime) / 1000;
    // this._showSec = this._calcSec.toFixed(2);
    // return this._duration / 1000;
    return this._calcSec;
  }
  get endduration() {
    return this._duration / 1000;
  }
}

// const stopwatch = new StopWatch();

// function durationTimeHtml() {
//   secSpan.innerHTML = stopwatch.duration;
// }

// let liveDuration;
// function showLiveDuration() {
//     liveDuration = setInterval(durationTimeHtml, 100);
// }

// const startBtn = document.querySelector("#startbtn");
// const stopBtn = document.querySelector("#stopbtn");
// // const newUser = document.querySelector("#newusr");
// const secSpan = document.querySelector("#secspan");

// startBtn.addEventListener("click", () => {
//   // running = true;
//   stopwatch.start();
//   showLiveDuration();
// });

// stopBtn.addEventListener("click", () => {
//     clearInterval(liveDuration);
//   stopwatch.stop();
//   // running = false;
// });
