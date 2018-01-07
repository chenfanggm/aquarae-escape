import _debug from 'debug'
import config from '../config'


const debug = _debug('app:arena')
class ArenaService {
  constructor() {
    this.users = {}
    this.receivedCmds = []
    this.flushRoomBuffer = this.flushRoomBuffer.bind(this)
  }

  addUser(ws, userId) {
    if (Object.values(this.users).length === 0) {
      setInterval(this.flushRoomBuffer, config.broadcastInterval)
    }
    this.users[userId] = {userId, ws}
    debug(`a new user joined, total user: ${Object.values(this.users).length}`)
  }

  getAllUser() {
    return this.users
  }

  removeUser(userId) {
    delete this.users[userId]
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
      const cmd = this.receivedCmds[i]
      const hash = `${cmd.userId}${cmd.type}`
      if (!broadcastCmds[hash]) {
        broadcastCmds[hash] = cmd
      }
    }
    debug(`broadcast ${Object.values(broadcastCmds).length} commands to ${Object.values(this.users).length} users`)
    Object.values(this.users).forEach((user) => {
      if (user.ws) {
        Object.values(broadcastCmds).forEach((cmd) => {
          if (user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({
              type: 'cmd',
              data: cmd
            }))
          } else {
            this.removeUser(user.userId)
          }
        })
      }
    })
  }
}

export default new ArenaService()