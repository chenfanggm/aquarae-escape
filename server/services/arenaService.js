import _debug from 'debug'
import config from '../config'


const debug = _debug('app:arena')
class ArenaService {
  constructor() {
    this.users = {}
    this.receivedCmds = []
    this.broadcastLoop = null

    this.flushRoomBuffer = this.flushRoomBuffer.bind(this)
  }

  addUser(ws, userId) {
    if (Object.values(this.users).length === 0) {
      this.broadcastLoop = setInterval(this.flushRoomBuffer, config.broadcastInterval)
    }
    this.users[userId] = {userId, ws}
    debug(`a new user joined, total user: ${Object.values(this.users).length}`)
  }

  getAllUser() {
    return this.users
  }

  removeUser(userId) {
    delete this.users[userId]
    if (Object.values(this.users).length === 0) {
      clearInterval(this.broadcastLoop)
    }
  }

  enqueueCmd(cmd) {
    this.receivedCmds.push(cmd)
  }

  flushRoomBuffer() {
    this.broadcast()
    this.receivedCmds = []
  }

  broadcast() {
    const broadcastCmds = {}
    for (let i = this.receivedCmds.length - 1; i > -1; i--) {
      const commands = this.receivedCmds[i]
      commands.forEach((cmd) => {
        const hash = `${cmd.ownerId}-${cmd.type}`
        if (!broadcastCmds[hash]) {
          broadcastCmds[hash] = cmd
        }
      })
    }

    if (Object.values(this.users).length > 0 && Object.values(broadcastCmds).length > 0) {
      debug(`broadcast ${Object.values(broadcastCmds).length} commands to ${Object.values(this.users).length} users`)
      Object.values(this.users).forEach((user) => {
        if (user.ws && user.ws.readyState === user.ws.OPEN) {
          user.ws.send(JSON.stringify({
            type: 'cmd',
            data: Object.values(broadcastCmds)
          }))
        } else {
          this.removeUser(user.userId)
        }
      })
    }

  }
}

export default new ArenaService()