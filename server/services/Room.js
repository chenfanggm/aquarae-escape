import uuid from 'uuid/v4'
import _debug from 'debug'
import config from '../config'


const debug = _debug('app:room')
class Room {
  constructor() {
    this.id = uuid()
    this.users = {}
    this.receivedCmds = []
    this.broadcastLoop = null
    this.USER_PER_ROOM = config.userNumPerRoom

    this.flushRoomBuffer = this.flushRoomBuffer.bind(this)
  }

  getId() {
    return this.id
  }

  isAvailableToJoin() {
    return Object.values(this.users).length < this.USER_PER_ROOM
  }

  addUser(user) {
    if (Object.values(this.users).length === 0) {
      this.broadcastLoop = setInterval(this.flushRoomBuffer, config.cmdBroadcastInterval)
    }
    this.users[user.userId] = user
    debug(`a new user joined, total user: ${Object.values(this.users).length}`)
    const cmd = {
      type: 'spawn',
      ownerId: user.userId
    }
    this.enqueueCmd([cmd])
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

  enqueueCmd(cmds) {
    this.receivedCmds.push(cmds)
  }

  flushRoomBuffer() {
    this.broadcastCMD()
    this.receivedCmds = []
  }

  broadcastCMD() {
    debug('receivedCmds:', this.receivedCmds)
    const broadcastCmds = {}
    this.receivedCmds.forEach((commands) => {
      for (let i = commands.length - 1; i >= 0; i--) {
        const cmd = commands[i]
        const hash = `${cmd.ownerId}-${cmd.type}`
        if (!broadcastCmds[hash]) {
          broadcastCmds[hash] = cmd
        }
      }
    })
    const users = Object.values(this.users)
    const commands = Object.values(broadcastCmds)
    if (users.length > 0 && commands.length > 0) {
      debug(`broadcast ${commands.length} commands to ${users.length} users`)
      debug('commands:', commands)
      users.forEach((user) => {
        if (user.ws && user.ws.readyState === user.ws.OPEN) {
          user.ws.send(JSON.stringify({
            type: 'cmd',
            data: commands
          }))
        } else {
          this.removeUser(user.userId)
        }
      })
    }
  }
}

export default Room