<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      @click="startGame()"
      v-if="!isStartHidden"
    >
      Start Game
    </button>
  </div>
</template>

<script>
import MancalaService from "../services/MancalaService";

export default {
  name: "start-game",
  props: ["isStartHidden"],
  data() {
    return {
      mancala: {},
      isHidden: this.isStartHidden,
    };
  },
  methods: {
    startGame() {
      MancalaService.startGame()
        .then((response) => {
          this.mancala = response.data;
          this.isHidden = true;
          this.$emit('isStartButtonHidden', this.isHidden)
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    //  this.retrieveTest();
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