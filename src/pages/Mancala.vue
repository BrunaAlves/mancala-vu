<template>
  <div>
    <h4>Lets Play Mancala</h4>
    <p>Current Player Name: {{ currentPlayer.username }}</p>
      <div class="board">
        <div class="large-pit-container" :active="currentPlayer.id === mancalaGame.players[0].id">
          <div class="pit" :key="mancalaGame.players[0].largePit.id" :active="false">
              {{ mancalaGame.players[0].largePit.stones }}
          </div>
        </div>
        <div class="pits-rows-container">
          <div class="pits-row" :active="currentPlayer.id === mancalaGame.players[0].id">
            <div class="pit" v-for="pit in mancalaGame.players[0].pits.filter((x, xi) => xi < mancalaGame.numberOfPits).reverse()" @click="getMoves(pit.id)" :key="pit.id" :active="currentPlayer.id === mancalaGame.players[0].id">
                {{ pit.stones }}
            </div>
          </div>
          <div class="pits-row" :active="currentPlayer.id === mancalaGame.players[1].id">
            <div class="pit" v-for="pit in mancalaGame.players[1].pits.filter((x, xi) => xi < mancalaGame.numberOfPits)" @click="getMoves(pit.id)" :key="pit.id" :active="currentPlayer.id === mancalaGame.players[1].id">
                {{ pit.stones }}
            </div>
          </div>
        </div>
        <div class="large-pit-container" :active="currentPlayer.id === mancalaGame.players[1].id">
          <div class="pit" :key="mancalaGame.players[1].largePit.id" :active="false">
              {{ mancalaGame.players[1].largePit.stones }}
          </div>
        </div>
      </div>
    <div>
      <EndButton />
    </div>
  </div>
</template>

<script>
import MancalaService from "../services/MancalaService";
import EndButton from "../components/EndButton.vue";


export default {
  name: "mancala-game",
  data() {
    return {
      firstPlayer: {},
      secondPlayer: {},
      currentPlayer: {},
    };
  },
  components: {
    EndButton,
  },
  methods: {
    getPlayerById(id) {
      return this.mancalaGame.players.find((x) => x.id === id)
    },
    getMoves(id) {
      MancalaService.getMoves(id)
        .then((response) => {
          this.mancalaGame = response.data;

          this.currentPlayer = this.getPlayerById(this.mancalaGame.currentPlayerId)

        })
        .catch((e) => {
          console.log(e);
        });
      console.log(id);
    },
    isLargePit(name){
      console.log(name)
      return name.includes("large");
    },
    isNotLargePit(name){
      console.log(name)
      return !name.includes("large");
    }
  },
  mounted() {
    MancalaService.getGame()
      .then((response) => {
        this.mancalaGame = response.data;
        this.currentPlayer = this.getPlayerById(this.mancalaGame.currentPlayerId)
      })
      .catch(() => {
        this.$router.push("start");
      });
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}

.board {
  padding: 24px;
  border: 1px solid rgb(97, 68, 9);
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-image: url("../assets/wood.jpeg");
  background-size: cover;
}

.board .pits-rows-container {
  display: flex;
  flex-direction: column;
}

.board .pits-rows-container .pits-row {
  display: flex; 
  flex-direction: row;
  padding: 12px;
}
.board .pits-rows-container .pits-row[active] {
  background-color: rgba(246, 148, 0, 0.264);
  border-radius: 20px;
}

.pit {
  min-width: 100px;
  height: 100px;
  border: 2px solid rgb(97, 68, 9);
  border-radius: 30px;
  background-color: #00000022;
  margin: 4px;
  color: white;
  font-weight: bold;
  font-size: 24px;
  padding-top: 24px;
}

.pit[active] {
  cursor: pointer;
}

.pit[active]:hover {
  background-color: rgba(142, 119, 83, 0.264);
  box-shadow: 0px 0px 10px white;
}

.large-pit-container[active] {
  background-color: rgba(246, 148, 0, 0.264);
}

.large-pit-container .pit {
  height: 248px;
  padding-top: 112px;
}

</style>