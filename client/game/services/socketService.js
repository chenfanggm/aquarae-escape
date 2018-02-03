import uuid from 'uuid/v4';
import Socket from './Socket';
import gameManager from '../managers/gameManager';
import objectManager from '../managers/objectManager';


class SocketService {
  constructor() {
    this.socket = new Socket();
    this.outCommandBuffer = [];
  }

  init() {
    return this.socket.init();
  }

  registerCMDHandler(callback) {
    this.socket.cmdlisteners.push(callback);
  }

  registerUserCMDHandler(userId, callback) {
    if (this.socket.userCmdListeners[userId]) {
      this.socket.userCmdListeners[userId].push(callback);
    } else {
      this.socket.userCmdListeners[userId] = [callback];
    }
  }

  enqueueCmd(cmd) {
    this.outCommandBuffer.push(cmd);
  }

  flushCmd() {
    // the last command of the same type
    const uniqueCmds = {};
    for (let i = this.outCommandBuffer.length - 1; i >= 0; i--) {
      const cmd = this.outCommandBuffer[i];
      if (!uniqueCmds[cmd.type]) {
        uniqueCmds[cmd.type] = cmd;
      }
    }
    this.sendCMD(Object.values(uniqueCmds));
    this.outCommandBuffer = [];
  }

  sendCMD(data) {
    const player = gameManager.getGame().getCurPlayer();
    const message = JSON.stringify({
      type: 'cmd',
      userId: player.id,
      data
    });
    this.socket.sendCMD(message);
  }

  post(path, data, cb) {
    if (this.socket.isAlive) {
      const message = {
        type: 'api',
        id: uuid(),
        path,
        method: 'POST',
        data
      };
      this.socket.sendAPI(message, cb);
    }
  }
}

export default new SocketService();