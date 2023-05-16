<template>
  <div class="col-md-6">
    <h4>Mandala</h4>
    <div>
      <StartButton
        :isStartHidden="isStartHidden"
        @isStartButtonHidden="onClickStart"
      />
      <EndButton 
        :isEndHidden="isEndHidden" 
        @isEndButtonHidden="onClickEnd" />
    </div>
  </div>
</template>

<script>
//import MancalaService from "../services/MancalaService";
import StartButton from "./StartButton.vue";
import EndButton from "./EndButton.vue";

export default {
  name: "mancala-game",
  data() {
    return {
      isStartHidden: false,
      isEndHidden: true,
    };
  },
  components: {
    StartButton,
    EndButton,
  },
  methods: {
    onClickStart(value) {
      this.isStartHidden = value;
      this.isEndHidden = !value;
      console.log(value);
    },
    onClickEnd(value) {
      this.isEndHidden = value;
      this.isStartHidden = !value;
    },
  },
  mounted() {},
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>