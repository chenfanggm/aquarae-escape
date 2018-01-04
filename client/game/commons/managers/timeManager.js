
class TimeManager {
  constructor() {
    this.prevTime = 0
    this.nowTime = 0
  }

  reset() {
    this.prevTime = 0
    this.nowTime = 0
  }

  setNowTime(timestamp) {
    this.nowTime = timestamp
  }

  updateTimer(timestamp) {
    this.prevTime = this.nowTime
    this.nowTime = timestamp
  }


  getDeltaTime() {
    return this.nowTime - this.prevTime
  }

  getTimeElapsed() {
    return this.nowTime
  }
}

const timeManager = new TimeManager()
export default timeManager