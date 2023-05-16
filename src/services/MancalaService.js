import http from "../http-common";

class MancalaService {
  getGame() {
    return http.get("/game");
  }
  startGame() {
    return http.post("/game/start");
  }
  endGame() {
    return http.delete("/game/end");
  }

}

export default new MancalaService();