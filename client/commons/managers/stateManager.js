
class StateManager {
  constructor() {
    this.prevTime = 0
    this.nowTime = 0
    this.delta = 0
  }

  reset() {
    this.prevTime = 0
    this.nowTime = 0
    this.delta = 0
  }

  setNowTime(timestamp) {
    this.nowTime = timestamp
  }

  updateTime(timestamp) {
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