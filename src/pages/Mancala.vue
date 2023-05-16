<template>
  <div class="col-md-6">
    <h4>Lets Play Mancala</h4>
    <p>Current PlayerId: {{currentPlayer.id}}</p>
    <p>Current Player Name: {{currentPlayer.username}}</p>
    <div class="card" id="game-container">
        <table>
            <tr>
                <td rowspan="2">
                  <div class="board-pit" :active="false">
                    {{mancalaGame.player1.largePit.stones}}
                  </div>
                </td>
                <td v-for="pit in mancalaGame.player1.pits" :key="pit.id">
                  <div class="board-pit" :active="currentPlayer.id === mancalaGame.player1.id">
                      {{pit.stones}}
                   </div>
                  </td>
                <td rowspan="2">
                  <div class="board-pit" :active="false">
                    {{mancalaGame.player2.largePit.stones}}
                  </div>
                </td>
            </tr>
            <tr>
                <td v-for="pit in mancalaGame.player2.pits" :key="pit.id">
                  <div class="board-pit" :active="currentPlayer.id === mancalaGame.player2.id">
                    {{pit.stones}}
                  </div>
                </td>
            </tr>
        </table>
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
      mancalaGame: {},
      currentPlayer: {}
    };
  },
  components: {
    EndButton,
  },
  methods: {
   
  },
  mounted() {
    MancalaService.getGame()
      .then((response) => {
        this.mancalaGame = response.data;
        this.currentPlayer = this.mancalaGame.currentPlayerId === this.mancalaGame.player1.id ? this.mancalaGame.player1 : this.mancalaGame.player2
      })
      .catch(() => {
        this.$router.push("start")
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

  #game-container {
   margin: 24px;
  }

  #game-container table {
     height: 300px; 
  }

  #game-container .board-pit {
    height: 60px;
    width: 60px;
  }

  #game-container .board-pit[active]:hover {
    box-shadow: 0px 0px 10px red;
    border-radius: 60px;
    
    cursor: pointer;
  }
</style>