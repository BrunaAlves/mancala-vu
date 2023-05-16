<template>
  <div class="col-md-6">
    <h4>Welcome to Mancala</h4>
    <div>
      <StartButton
        :isStartHidden="isStartHidden"
        @isStartButtonHidden="onClickStart"
      />
    </div>
  </div>
</template>

<script>
import StartButton from "../components/StartButton.vue";

export default {
  name: "mancala-game-start",
  data() {
    return {
    };
  },
  components: {
    StartButton,
  },
  methods: {
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