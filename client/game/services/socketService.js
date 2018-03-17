import uuid from 'uuid/v4';
import Socket from './Socket';
import gameManager from '../managers/gameManager';


class SocketService {
  constructor() {
    this.socket = new Socket();
    this.outCommandBuffer = [];
  }

  init() {
    return this.socket.init();
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
      } else {
        uniqueCmds[cmd.type].data = Object.assign(uniqueCmds[cmd.type].data, cmd.data);
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
