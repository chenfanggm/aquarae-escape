class GameManager {
  constructor() {
    this.game = null;
  }

  setGame(game) {
    return this.game = game;
  }

  getGame() {
    return this.game;
  }
}

const gameManager = new GameManager();
export default gameManager;