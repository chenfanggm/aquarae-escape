
class StateManager {
  constructor() {
    this.startTime = null
    this.prevTime = null
    this.nowTime = null
    this.isReadingTime = false
  }

  getDelta() {
    if (!this.startTime || !this.prevTime) {
      this.startTime = this.prevTime = Date.now()
      return 0
    } else if (!this.isReadingTime) {
      this.isReadingTime = true
      this.nowTime = Date.now()
      this.elapsedTime = parseFloat(this.nowTime - this.prevTime)
      this.prevTime = this.nowTime
      return this.elapsedTime
    } else {
      return this.elapsedTime
    }
  }

  getTimeElapsed() {
    if (!this.startTime || !this.prevTime) {
      this.startTime = this.prevTime = Date.now()
      return 0
    } else {
      return parseFloat(Date.now() - this.startTime)
    }
  }

  resetDelta() {
    this.isReadingTime = false
  }
}

const stateManager = new StateManager()
export default stateManager