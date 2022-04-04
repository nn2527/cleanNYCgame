let App = Vue.createApp({
  data() {
    //Generate a 10*10 map
    let min = 6;
    let max = 55;
    let arrayforx = [];
    let arrayfory = [];
    let grid = 10;
    for (let i = 0; i <= grid; i++) {
      arrayforx.push(min + ((max - min) / grid) * i);
    }
    min = 12;
    max = 86;
    for (let i = 0; i <= grid; i++) {
      arrayfory.push(min + ((max - min) / grid) * i);
    }
    //Generate a random position for the player
    let randx = Math.floor(Math.random() * grid);
    let randy = Math.floor(Math.random() * grid);
    return {
      key: "",
      arrayforx: arrayforx,
      arrayfory: arrayfory,
      playerx: randx,
      playery: randy,
      grid: grid,
      score: 0,
      keycopy: "",
      number: 10,
      started: false,
      gamefinished: false,
      replay: false,
      countdown: 15,
      totalTime: 15,
      playerStatus: "Wohoo! You are a winner!",
      countdownIntervalID: null
    };
  },
  watch: {
    score(newScore) {
      if (newScore >= 10) {
        this.endGame();
      }
    }
  },
  computed: {},
  methods: {
    updatep(add) {
      this.score += add;
    },
    endGame() {
       clearInterval(this.countdownIntervalID);
      this.countdownIntervalID = null;
      if (this.score < 10) {
        this.playerStatus = "You lost!";
      }
      this.gamefinished = true;
    },
    startGame() {
      this.started = true;
      if (this.countdownIntervalID != null) return;
      this.countdown = this.totalTime;
      this.countdownIntervalID = setInterval(() => {
        this.countdown--;
        if (this.countdown == 0) {
          this.endGame();
        }
      }, 1000);
    },
    resetInput() {
      this.replay = true;
    },
    move() {
      if (this.key == "w" && this.playery > 0) {
        this.playery -= 1;
      } else if (this.key == "s" && this.playery < this.grid) {
        this.playery += 1;
      } else if (this.key == "a" && this.playerx > 0) {
        this.playerx -= 1;
      } else if (this.key == "d" && this.playerx < this.grid) {
        this.playerx += 1;
      }
      this.keycopy += this.key;
      this.key = "";
    }
  }
});

App.component("trash", {
  props: ["arrayforx", "arrayfory", "grid", "keycopy", "replay"],
  data() {
    let rand1 = Math.floor(Math.random() * this.grid);
    let rand2 = Math.floor(Math.random() * this.grid);
    while (rand1 == this.$parent.playerx && rand2 == this.$parent.playery) {
      rand1 = Math.floor(Math.random() * this.grid);
      rand2 = Math.floor(Math.random() * this.grid);
    }
    let rand3 = Math.floor(Math.random() * 3);
    let listofurls = [
      "https://assets.codepen.io/6909773/1723100+%281%29.png",
      "https://assets.codepen.io/6909773/1723100+%282%29.png",
      "https://assets.codepen.io/6909773/1723100+%283%29.png"
    ];
    return {
      trashx: Math.floor(Math.random() * this.grid),
      trashy: Math.floor(Math.random() * this.grid),
      picked: false,
      url: "url(" + listofurls[rand3] + ")"
    };
  },
  template: `<div class="trash" :class="{disappear: picked}" v-bind:style="{ 'left': arrayforx[trashx] + 'vw', 'top': arrayfory[trashy] +'vh', 'background': url, 'background-size': 'contain', 'background-repeat': 'no-repeat'}"></div>
  `,
  computed: {},
  watch: {
    // This would be called anytime these data of parent change
    keycopy() {
      this.pickup();
    },
    replay() {
      this.$parent.started = false;
      this.$parent.score = 0;
      this.picked = false;
      this.$parent.gamefinished = false;
      this.$parent.replay = false;
    }
  },
  methods: {
    pickup() {
      if (
        this.$parent.playerx == this.trashx &&
        this.$parent.playery == this.trashy &&
        this.picked == false
      ) {
        this.picked = true;
        this.$emit("updatep", 1);
      }
    }
  }
});

App.mount("#app");
