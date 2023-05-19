<template>
  <div>
    <h4>Lets Play Mancala</h4>
    <div v-if="!isLoading">
      <p>Current Player Name: {{ getCurrentPlayer().username }}</p>
      <p>IsProcessing: {{ isProcessing }}</p>
      <div class="board">
        <div class="large-pit-container" :active="isPlayer0Active()">
          <div class="pit" :key="player0.largePit.id" :active="false">
              {{ player0.largePit.stones }}
              <div class="pit-action" :action="player0.largePit.actionType">{{player0.largePit.actionLabel}}</div>
          </div>
        </div>
        <div class="pits-rows-container">
          <div class="pits-row" :active="isPlayer0Active()">
            <div class="pit" v-for="pit in player0.pits.filter((x, xi) => xi < game.numberOfPits).reverse()" @click="getActions(pit.id)" :key="pit.id" :active="isPlayer0Active() && pit.stones > 0">
                {{ pit.stones }}
                <div class="pit-action" :action="pit.actionType">{{pit.actionLabel}}</div>
            </div>
          </div>
          <div class="pits-row" :active="isPlayer1Active()">
            <div class="pit" v-for="pit in player1.pits.filter((x, xi) => xi < game.numberOfPits)" @click="getActions(pit.id)" :key="pit.id" :active="isPlayer1Active() && pit.stones > 0">
                {{ pit.stones }}
                <div class="pit-action" :action="pit.actionType">{{pit.actionLabel}}</div>
            </div>
          </div>
        </div>
        <div class="large-pit-container" :active="isPlayer1Active()">
          <div class="pit" :key="player1.largePit.id" :active="false">
              {{ player1.largePit.stones }}
              <div class="pit-action" :action="player1.largePit.actionType">{{player1.largePit.actionLabel}}</div>
          </div>
        </div>
        <BoardNotification :isOpen="game.notification !== null" :text="game.notification" />
      </div>
      
      <div>
        <EndButton />
      </div>
    </div>
  </div>
</template>

<script>
import MancalaService from "../services/MancalaService";
import EndButton from "../components/EndButton.vue";
import BoardNotification from "../components/BoardNotification.vue"
import sleep from "../helpers/Sleep";

export default {
  name: "mancala-game",
  data() {
    return {
      isProcessing: false,
      isLoading: true,
      player0: {
        id: '',
        username: '',
        largePit: {},
        pits: []
      },
      player1: {
        id: '',
        username: '',
        largePit: {},
        pits: []
      },
      currentPlayerId: '',
      game: {
        numberOfPits: 0,
        allPints: [],
        notification: null
      }
    };
  },
  components: {
    EndButton,
    BoardNotification,
  },
  methods: {
    isPlayer0Active(){
      return !this.isLoading && !this.isProcessing && this.currentPlayerId === this.player0.id
    },
    isPlayer1Active(){
      return !this.isLoading && !this.isProcessing && this.currentPlayerId === this.player1.id 
    },
    getCurrentPlayer() {
      return this.getPlayerById(this.currentPlayerId)
    },
    getPlayerById(id) {
      return this.player0.id === id ? this.player0 : this.player1
    },
    getActions(id) {
      this.cleanAllPitsActions();
      MancalaService.getActions(id)
        .then((response) => {
          const actions = response.data.actions;
          this.isProcessing = true;
          let actionIndex = 0;
          const tickTime = 700;
          const tick = async () => {
            if(actionIndex < actions.length){
              const action = actions[actionIndex];
              if(action.actionType === "MOVE"){
                console.info(action)
                await this.processMoveAction(action)
              }else if(action.actionType === "NEXT_PLAYER"){
                await this.processNextPlayerAction(action)
              }else if(action.actionType === "PLAY_AGAIN"){
                await this.processPlayAgainAction(action)
              }else if(action.actionType === "CAPTURE_STONES"){
                await this.processCaptureStonesAction(action)
              }else if(action.actionType === "GAME_OVER"){
                await this.processGameOverAction(action);
              }else if(action.actionType === "WINNER"){
                await this.processWinnerAction(action);
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
      const fromPit = this.game.allPints.find((x) => x.id === action.fromPitId);
      const toPit = this.game.allPints.find((x) => x.id === action.toPitId);
      fromPit.stones -= action.moveQuantity;
      toPit.stones += action.moveQuantity;
      this.setPitAction(fromPit, "remove", action.moveQuantity);
      this.setPitAction(toPit, "add", action.moveQuantity);
    },
    async processNextPlayerAction(action){
      this.currentPlayerId = action.id;
      await this.showNotification("Next player turn: " + this.getCurrentPlayer().username)
    },
    async processPlayAgainAction(){
      await this.showNotification("Play again: " + this.getCurrentPlayer().username)
    },
    async processCaptureStonesAction(action){
      this.cleanAllPitsActions();
      await this.showNotification("CAPTURE STONES MOVEEE!");
      const oppositePit = this.game.allPints.find((x) => x.id === action.oppositePitId);
      const ownPit = this.game.allPints.find((x) => x.id === action.ownPitId);
      const largePit = this.game.allPints.find((x) => x.id === action.largePitId);
      oppositePit.stones -= action.removedOppositeStonesQuantity;
      this.setPitAction(oppositePit, "remove", action.removedOppositeStonesQuantity);

      ownPit.stones -= action.removedOwnPitStonesQuantity;
      this.setPitAction(ownPit, "remove", action.removedOwnPitStonesQuantity);

      largePit.stones += action.addedLargePitStonesQuantity;
      this.setPitAction(largePit, "add", action.addedLargePitStonesQuantity);
    },
    async processGameOverAction(action){
      console.info(action)
      await this.showNotification("Game is over!");
    },
    async processWinnerAction(action){
      console.info(action)
      await this.showNotification("WINNER: " + this.getPlayerById(action.winnerPlayerId).username);
    },
    async showNotification(text) {
      this.game.notification = text;
      await sleep(2000);
      this.game.notification = null;
    },
    setPitAction(pit, action, value){
      pit.actionType = action;
      if(value > 0)
        pit.actionValue = pit.actionValue ? pit.actionValue + value :value;
      if(pit.actionValue)
        pit.actionLabel = (action === "add" ? "+" : "-") + pit.actionValue;
    },
    cleanAllPitsActions(){
      this.game.allPints.forEach((x) => {
        x.actionType = null;
        x.actionValue = null;
        x.actionLabel = null
      })
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
        this.currentPlayerId = mancalaGame.currentPlayerId;
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
  background-color: rgb(255 255 255 / 25%);
  box-shadow: 0px 0px 20px rgb(255 255 255 / 25%);
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

.pit .pit-action {
  font-size: 18px;
  width: fit-content;
  margin: 0 auto;
  box-shadow: 0px 0px 20px white;
  background: #ffffff61;
  padding: 0px 5px;
  border-radius: 10px;
}

.pit .pit-action[action="add"]{
  color: rgb(2, 154, 2);
}

.pit .pit-action[action="remove"]{
  color: rgb(255, 29, 29);
}

.pit[active] {
  cursor: pointer;
}

.pit[active]:hover {
  background-color: rgba(142, 119, 83, 0.264);
  box-shadow: 0px 0px 10px white;
}

.large-pit-container[active] {
  background-color: rgb(255 255 255 / 25%);
  box-shadow: 0px 0px 20px rgb(255 255 255 / 25%);
}

.large-pit-container .pit {
  height: 248px;
  padding-top: 112px;
}

</style>