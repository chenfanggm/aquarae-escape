
class StateManager {
  constructor() {
    this.prevTime = 0
    this.nowTime = 0
    this.delta = 0
  }

  setTime(timestamp) {
    this.prevTime = this.nowTime
    this.nowTime = timestamp
  }

  getDelta() {
    return this.nowTime - this.prevTime
  }

  resetDelta() {
    this.delta = 0
  }

  getTimeElapsed() {
    return this.nowTime
  }
}

const stateManager = new StateManager()
export default stateManager