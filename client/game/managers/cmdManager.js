import timeManager from './timeManager';
import gameManager from './gameManager';


class CMDManager {
  constructor() {
    this.cmds = [];
    this.cmdlisteners = [];
    this.userCmdListeners = [];
    this.game = null;
  }

  setCmdQueue(cmds) {
    this.cmds = cmds;
  }

  enqueue(cmd) {
    return this.cmds.push(cmd);
  }

  preCatchProcess() {
    const curEpoch = this.cmds.length > 0 ? this.cmds[this.cmds.length -1].epoch : 0;
    const lastEpoch = timeManager.getLastEpoch();
    const curEpochOffset = timeManager.getCurEpochOffset();
    // fast forward
    if (lastEpoch < 3) {
      console.log("[cmdManager] " + "curEpoch=" + curEpoch + ", lastEpoch=" + lastEpoch);
      for (var i=0; i<19; i++)
        console.log("cmds=", this.cmds[i]);
    }

    this.cmds.forEach((cmd, idx) => {
      var nonEmpty = false;
      if (cmd.epoch < curEpoch) {
        console.log("my cmd", cmd);
          // fast forward

          var multiply = 1;
          this.updateObjectState(cmd);
          if (idx < this.cmds.length - 1) {
            var nextEpoch = this.cmds[idx+1].epoch;
            multiply = nextEpoch - cmd.epoch + 1;
          }

          for (var m=0; m<multiply; m++) {

            var t = 0;
            while (t     < timeManager.logicTimePerEpoch) {
              var deltaT = timeManager.frameTimePerUpdate;
              if (t + deltaT > timeManager.logicTimePerEpoch) {
                deltaT = timeManager.logicTimePerEpoch - t - deltaT
              }
              console.log("FF'ed a cmd at epoch ", cmd.epoch, "deltaT=", deltaT, "multiply=", multiply)
              console.log('game', gameManager.getGame());
              gameManager.getGame().update(deltaT);
              gameManager.getGame().render();
              t += deltaT;
            }
          }
      }
    });
  }

  process() {
    const curEpoch = timeManager.getCurEpoch();
    const lastEpoch = timeManager.getLastEpoch();
    const curEpochOffset = timeManager.getCurEpochOffset();

    if (lastEpoch < 3) {
      console.log("[cmdManager] " + "curEpoch=" + curEpoch + ", lastEpoch=" + lastEpoch);
      for (var i=0; i<9; i++)
        console.log("cmds=", this.cmds[i]);
    }

    for (let processingEpoch = lastEpoch; processingEpoch <= curEpoch; processingEpoch++) {
      const leftCmds = this.cmds.filter((cmd) => {
        if (cmd.epoch < processingEpoch) {
          // fast forward
          this.updateObjectState(cmd);
          var t = 0;
          while (t < timeManager.logicTimePerEpoch) {
            var deltaT = timeManager.frameTimePerUpdate;
            if (t + deltaT > timeManager.logicTimePerEpoch) {
              deltaT = timeManager.logicTimePerEpoch - t - deltaT
            }
            console.log("FF epoch", cmd.epoch, "deltaT=", deltaT)
            gameManager.getGame().update(deltaT);
            t += deltaT;
          }
          return false;
        } else if (cmd.epoch === processingEpoch && cmd.curEpochOffset < curEpochOffset) {
          // normal game speed
          this.updateObjectState(cmd);
        }
        return true;
      });
      timeManager.setLastEpoch(curEpoch);
      this.cmds = leftCmds;
    }

  }

  updateObjectState(cmd) {
    this.cmdlisteners.forEach((listener) => {
      listener(cmd);
    });
    const userId = cmd.userId;
    if (userId)  {
      if (this.userCmdListeners[userId]) {
        console.log('here', cmd);
        this.userCmdListeners[userId].forEach((listener) => {
          listener(cmd);
        });
      }
    }
  }

  registerCMDHandler(callback) {
    this.cmdlisteners.push(callback);
  }

  registerUserCMDHandler(userId, callback) {
    if (this.userCmdListeners[userId]) {
      this.userCmdListeners[userId].push(callback);
    } else {
      this.userCmdListeners[userId] = [callback];
    }
  }
}

const cmdManager = new CMDManager();
export default cmdManager;
