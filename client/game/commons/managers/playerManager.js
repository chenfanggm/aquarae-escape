class PlayerManager {
  constructor() {
    this.curPlayer = null
  }

  setCurPlayer(player) {
    return this.curPlayer = player
  }

  getCurPlayer() {
    return this.curPlayer
  }
}

const playerManager = new PlayerManager()
export default playerManager