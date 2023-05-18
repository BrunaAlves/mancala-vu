<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      @click="startGame()"
    >
      Start Game
    </button>
  </div>
</template>

<script>
import MancalaService from "../services/MancalaService";

export default {
  name: "start-game",
  data() {
    return {
      mancala: {}
    };
  },
  methods: {
    startGame() {
      MancalaService.startGame()
        .then((response) => {
          this.mancala = response.data;
          this.$router.push("/game")

        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>