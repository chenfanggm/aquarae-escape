import _debug from 'debug'
import config from '../config'
import Room from '../entities/Room'


const debug = _debug('app:hall');

class ArenaService {
  constructor() {
    this.users = {};
    this.rooms = {};
    this.wsToUser = new WeakMap();
    this.USER_PER_ROOM = config.userPerRoom
  }

  addUserToRoom(user) {
    this.users[user.id] = user;
    this.wsToUser.set(user.ws, user);
    debug(`A new user logged in, total user: ${Object.values(this.users).length}`);
    const room = this.findNextAvailableRoom();
    room.addUser(user);
    user.room = room;
    this.rooms[room.id] = room;
    return room
  }

  getUser(userId) {
    return this.users[userId]
  }

  getUserBySocket(ws) {
    return this.wsToUser.get(ws)
  }

  getRoomByUserId(userId) {
    const user = this.users[userId];
    return user && user.room
  }

  findNextAvailableRoom() {
    let availableRoom = null;
    const rooms = Object.values(this.rooms);
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].isAvailableToJoin()) {
        availableRoom = rooms[i];
        return availableRoom
      }
    }
    return new Room()
  }

  removeUser(user) {
    user.room.removeUser(user);
    if (user.room.isEmpty()) {
      delete this.rooms[user.room.id]
    }
    this.wsToUser.delete(user.ws);
    delete this.users[user.id]
  }
}

export default new ArenaService()