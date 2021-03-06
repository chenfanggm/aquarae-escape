import uuid from 'uuid/v4'
import _debug from 'debug'
import config from '../config'


const debug = _debug('app:room');
class Room {
  constructor() {
    this.id = uuid();
    this.users = {};
    this.receivedCmds = [];
    this.flushedCmds = [];
    this.broadcastLoop = null;
    this.USER_PER_ROOM = config.userPerRoom;
    this.BROADCAST_LOOP_INTERVAL = config.SERVER_BROADCAST_INTERVAL;
    this.curEpoch = 0;
    this.flushCMDBuffer = this.flushCMDBuffer.bind(this)
  }

  isAvailableToJoin() {
    return Object.values(this.users).length < this.USER_PER_ROOM
  }

  addUser(user) {
    // start room broadcast loop if it's a new room
    if (Object.values(this.users).length === 0 && !this.broadcastLoop) {
      this.broadcastLoop = setInterval(this.flushCMDBuffer, this.BROADCAST_LOOP_INTERVAL)
    }
    // add user to room
    this.users[user.id] = user;
    debug(`Added a new user to room, total user: ${Object.values(this.users).length}`);
    // inform other user with the new spawn
    const cmd = {
      type: 'spawn',
      userId: user.id,
      data: {
        position: user.position,
      }
    };
    this.enqueueCMD([cmd]);
  }

  getAllUser() {
    return this.users
  }

  removeUser(user) {
    delete this.users[user.id];
    if (Object.values(this.users).length === 0) {
      clearInterval(this.broadcastLoop)
    }
  }

  isEmpty() {
    return Object.values(this.users).length === 0
  }

  enqueueCMD(commands) {
    this.receivedCmds.push(commands)
  }

  flushCMDBuffer() {
    const cmdCopy = this.receivedCmds;
    this.receivedCmds = [];
    this.curEpoch++;
    console.log(cmdCopy);
    this.broadcastCMD(cmdCopy)
  }

  mergeCMD(receivedCmds) {
    const mergedCmds = {};
    // filter last command of the same time
    receivedCmds.forEach((commands) => {
      for (let i = commands.length - 1; i >= 0; i--) {
        const cmd = commands[i];
        const hash = `${cmd.userId}-${cmd.type}`;
        if (!mergedCmds[hash]) {
          mergedCmds[hash] = cmd
        } else {
          mergedCmds[hash].data = Object.assign(mergedCmds[hash].data,
            receivedCmds.data);
        }
      }
    });
    return mergedCmds;
  }

  broadcastCMD(receivedCmds) {
    const broadcastCmds = this.mergeCMD(receivedCmds);
    const users = Object.values(this.users);
    const commands = Object.values(broadcastCmds);
    if (users.length > 0) {
      //debug(`Broadcast ${commands.length} commands to ${users.length} users`);
      //debug('Commands:', commands);
      users.forEach((user) => {
        if (user.ws && user.ws.readyState === user.ws.OPEN) {
          const userBroadcastCmd = {
            type: 'cmd',
            data: commands,
            epoch: this.curEpoch
          };
          user.ws.send(JSON.stringify(userBroadcastCmd));
          this.flushedCmds.push(userBroadcastCmd);
        } else {
          this.removeUser(user.id)
        }
      })
    }
  }
}

export default Room
