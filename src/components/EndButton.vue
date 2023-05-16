<template>
  <div>
    <button
      type="button"
      class="btn btn-danger"
      @click="endGame()"
      v-if="!isEndHidden"
    >
      End Game
    </button>
  </div>
</template>

<script>
import MancalaService from "../services/MancalaService";

export default {
  name: "end-game",
  props: ["isEndHidden"],
  data() {
    return {
      isHidden: this.isEndHidden
    };
  },
  methods: {
    endGame() {
      MancalaService.endGame()
        .then(() => {
          this.$router.push("/start")
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