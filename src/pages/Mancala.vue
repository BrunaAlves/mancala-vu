<template>
  <div>
    <h4>Lets Play Mancala</h4>
    <p>Current Player Name: {{ currentPlayer.username }}</p>
    <p>IsProcessing: {{ isProcessing }}</p>
      <div class="board" v-show="!isLoading">
        <div class="large-pit-container" :active="isPlayer0Active()">
          <div class="pit" :key="player0.largePit.id" :active="false">
              {{ player0.largePit.stones }}
          </div>
        </div>
        <div class="pits-rows-container">
          <div class="pits-row" :active="isPlayer0Active()">
            <div class="pit" v-for="pit in player0.pits.filter((x, xi) => xi < game.numberOfPits).reverse()" @click="getActions(pit.id)" :key="pit.id" :active="isPlayer0Active()">
                {{ pit.stones }}
            </div>
          </div>
          <div class="pits-row" :active="isPlayer1Active()">
            <div class="pit" v-for="pit in player1.pits.filter((x, xi) => xi < game.numberOfPits)" @click="getActions(pit.id)" :key="pit.id" :active="isPlayer1Active()">
                {{ pit.stones }}
            </div>
          </div>
        </div>
        <div class="large-pit-container" :active="isPlayer1Active()">
          <div class="pit" :key="player1.largePit.id" :active="false">
              {{ player1.largePit.stones }}
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
      isProcessing: false,
      isLoading: true,
      player0: {
        id: '',
        username: '',
      },
      playerB: {},
      currentPlayer: {
        id: '',
        username: ''
      },
      game: {
        numberOfPits: 0
      }
    };
  },
  components: {
    EndButton,
  },
  methods: {
    isPlayer0Active(){
      return !this.isLoading && !this.isProcessing && this.currentPlayer.id === this.player0.id 
    },
    isPlayer1Active(){
      return !this.isLoading && !this.isProcessing && this.currentPlayer.id === this.player1.id 
    },
    getPlayerById(id) {
      return this.player0.id === id ? this.player0 : this.player1
    },
    getActions(id) {
      MancalaService.getActions(id)
        .then((response) => {
          const actions = response.data.actions;

          this.isProcessing = true;
          let actionIndex = 0;
          const tickTime = 700;
          const tick = () => {
             if(actionIndex < actions.length){
              const action = actions[actionIndex];
                if(action.actionType === "MOVE"){
                this.processMoveAction(action)
              }

              actionIndex++;
              setTimeout(tick, tickTime)
            }else{
              this.isProcessing = false;
            }
          }
          setTimeout(tick, tickTime)
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
    },
    processMoveAction(action){
      console.info(action)
      const fromPit = this.game.allPints.find((x) => x.id === action.fromPitId);
      const toPit = this.game.allPints.find((x) => x.id === action.toPitId);
      fromPit.stones -= action.moveQuantity;
      toPit.stones += action.moveQuantity;
    },
    setupBoard(){
       MancalaService.getGame()
      .then((response) => {
        const mancalaGame = response.data;
        this.player0 = {
          id: mancalaGame.players[0].id,
          username: mancalaGame.players[0].username,
          largePit: mancalaGame.players[0].pits[mancalaGame.players[0].pits.length - 1],
          pits: mancalaGame.players[0].pits,
        }
        this.player1 = {
          id: mancalaGame.players[1].id,
          username: mancalaGame.players[1].username,
          largePit: mancalaGame.players[1].pits[mancalaGame.players[1].pits.length - 1],
          pits: mancalaGame.players[1].pits,
        }
        this.game.numberOfPits = mancalaGame.numberOfPits;
        this.game.allPints = [].concat(this.player0.pits).concat(this.player1.pits);
        this.currentPlayer = this.getPlayerById(mancalaGame.currentPlayerId);
        this.isLoading = false;
      })
      .catch(() => {
        this.$router.push("start");
      });
    }
  },
  mounted() {
   this.setupBoard();
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