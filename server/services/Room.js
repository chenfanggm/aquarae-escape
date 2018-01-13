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
    // 1. inform the newly-added user of the other users
    //    Immediately respond.
    // This code snippet does not work
    var x = [];
    try {
      var u = Object.values(this.users).slice();

      if (u.length > 0) { // THIS STMT CAN GIVE AN ERROR ?????
        for (var i = 0; i < u.length; i++) x.push(u[i].userId);
      }
      console.log(">>>> existing player count = " + u.length);
    } catch (err) {
      // May happen 'x.append is not a function.' ????
      //  should use 'push' rather than 'append'
      console.log(">>>> " + err)
      console.log(x);
    }


    const cmd1 = {
      type: 'loginResponse',
      ownerId: user.userId,
      existingUserIds: x,
    }

    setTimeout(function() {
      console.log(">>> ");
      console.log(cmd1);
      console.log(">>> " + user.userId);
      var res = "";
      if (user.ws && user.ws.readyState === user.ws.OPEN) {
        user.ws.send(JSON.stringify({
          type: 'cmd',
          data: [cmd1],
          ownerId: user.id
        }));
        res = "sent";
      } else { res = "could not send"; }
      console.log("Send Login Response (" + cmd1.existingUserIds.length + " result = "+res);
    }, 1234);

    // 2. inform the other users of the newly-added user
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
    var x = this.receivedCmds;
    if (!(x.length == 0) && !(x.length == 1 && x[0].length == 0)) {
      //debug('receivedCmds:', this.receivedCmds);
    }
    const broadcastCmds = {}
    x.forEach((commands) => {
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