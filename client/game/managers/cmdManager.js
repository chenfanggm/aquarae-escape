import timeManager from './timeManager';


class CMDManager {
  constructor() {
    this.cmds = [];
    this.cmdlisteners = [];
    this.userCmdListeners = [];
  }

  enqueue(cmd) {
    return this.cmds.push(cmd);
  }

  process() {
    const curEpoch = timeManager.getCurEpoch();
    const lastEpoch = timeManager.getLastEpoch();
    const curEpochOffset = timeManager.getCurEpochOffset();
    for (let processingEpoch = lastEpoch; processingEpoch <= curEpoch; processingEpoch++) {
      const leftCmds = this.cmds.filter((cmd) => {
        if (cmd.epoch < processingEpoch ||
          (cmd.epoch === processingEpoch && cmd.curEpochOffset < curEpochOffset)) {
          this.cmdlisteners.forEach((listener) => {
            listener(cmd);
          });
          const userId = cmd.userId;
          if (userId)  {
            if (this.userCmdListeners[userId]) {
              this.userCmdListeners[userId].forEach((listener) => {
                listener(cmd);
              });
            }
          }
          return false;
        }
        return true;
      });

      this.cmds = leftCmds;
    }

    timeManager.setLastEpoch(curEpoch);
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
