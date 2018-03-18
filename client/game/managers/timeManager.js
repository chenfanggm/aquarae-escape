import config from '../config';


class TimeManager {
  constructor() {
    this.prevTime = 0;
    this.prevLogicTime = 0;
    this.nowTime = 0;
    this.lastEpoch = this.curEpoch = -1;
    this.epochStartTime = -1;
    this.logicTimePerEpoch = 1000 / config.game.logicFPS;
    this.frameTimePerUpdate = 1000 / config.game.renderFPS;
  }

  reset() {
    this.prevTime = 0;
    this.prevLogicTime = 0;
    this.nowTime = 0;
  }

  startEpoch(epoch) {
    this.lastEpoch = this.curEpoch = 0;
    this.epochStartTime = Date.now();
  }

  setCurEpoch(epoch) {
    this.curEpoch = epoch;
    this.epochStartTime = Date.now();
  }

  setLastEpoch(epoch) {
    this.lastEpoch = epoch;
  }

  setNowTime(timestamp) {
    this.nowTime = timestamp;
  }

  updateTimer(timestamp) {
    this.prevTime = this.nowTime;
    this.nowTime = timestamp;
  }

  updateLogicTimer(timestamp) {
    this.prevLogicTime = this.nowTime;
    this.nowTime = timestamp;
  }

  getDeltaTime() {
    return this.nowTime - this.prevTime;
  }

  getLogicDeltaTime() {
    return this.nowTime - this.prevLogicTime;
  }

  getTimeElapsed() {
    return this.nowTime;
  }

  getCurEpochOffset() {
    let curEpochOffset = Date.now() - timeManager.epochStartTime;
    if (this.curEpochOffset > this.logicTimePerEpoch) this.curEpochOffset = this.logicTimePerEpoch;
    return curEpochOffset;
  }

  getCurEpoch() {
    return this.curEpoch;
  }

  getLastEpoch() {
    return this.lastEpoch;
  }
}

const timeManager = new TimeManager();
export default timeManager;
