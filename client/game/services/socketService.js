import uuid from 'uuid/v4'
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
  }

  init() {
    return this.socket.init()
  }

  registerGeneralHandler(callback) {
    this.socket.generalListeners.push(callback)
  }

  registerUserHandler(userId, callback) {
    if (this.socket.listeners[userId]) {
      this.socket.listeners[userId].push(callback)
    } else {
      this.socket.listeners[userId] = [callback]
    }
  }

  enqueueCmd(cmd) {
    this.outCommandBuffer.push(cmd)
  }

  flushCmd(roomId) {
    // If there are multiple moves take only the last one
    const uniqueCmds = {}
    for (let i = this.outCommandBuffer.length - 1; i >= 0; i--) {
      const cmd = this.outCommandBuffer[i]
      if (!uniqueCmds[cmd.type]) {
        uniqueCmds[cmd.type] = cmd
      }
    }
    this.sendCmd(roomId, Object.values(uniqueCmds))
    this.outCommandBuffer = []
  }

  sendCmd(roomId, data) {
    const message = JSON.stringify({
      type: 'cmd',
      roomId,
      data
    })
    this.socket.sendCMD(message)
  }

  post(path, data, cb) {
    if (this.socket.isAlive) {
      const apiId = uuid()
      const message = JSON.stringify({
        id: apiId,
        type: 'api',
        path,
        method: 'POST',
        data
      })
      this.socket.sendAPI(apiId, message, cb)
    }
  }
}

export default new SocketService()