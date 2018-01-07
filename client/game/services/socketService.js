import Socket from './Socket'


class SocketService {
  constructor() {
    if (window.aquarae && window.aquarae.socket) {
      this.socket = window.aquarae.socket
    } else {
      window.aquarae = {}
      this.socket = window.aquarae.socket = new Socket()
    }
    this.outCommandBuffer = []
    this.socket.init()
  }

  register(userId, callback) {
    if (this.socket.listeners[userId]) {
      this.socket.listeners[userId].push(callback)
    } else {
      this.socket.listeners[userId] = [callback]
    }
  }

  enqueueCmd(cmd) {
    this.outCommandBuffer.push(cmd)
  }

  flushCmd() {
    // If there are multiple moves take only the last one
    const numCmds = this.outCommandBuffer.length;
    const commands = {}
    for (let i=numCmds-1; i>=0; i--) {
      const cmd = this.outCommandBuffer[i]
      if (!commands.hasOwnProperty(cmd.type)) {
        commands[cmd.type] = cmd
      }
    }
    this.sendCmd(Object.values(commands))
    this.outCommandBuffer = [];
  }

  sendCmd(data) {
    if (this.socket.isAlive) {
      this.socket.send(JSON.stringify({
        type: 'cmd',
        data
      }))
    }
  }

  post(path, data) {
    if (this.socket.isAlive) {
      this.socket.send(JSON.stringify({
        type: 'api',
        path,
        method: 'POST',
        data
      }))
    }
  }
}

export default new SocketService()