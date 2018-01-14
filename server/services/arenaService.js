import _debug from 'debug'
import config from '../config'
import Room from './Room'


const debug = _debug('app:hall')

class ArenaService {
  constructor() {
    this.users = {}
    this.rooms = []
    this.USER_PER_ROOM = config.userPerRoom
  }

  addNewUserToRoom(ws, userId) {
    if (this.users[userId]) {
      return this.users[userId].room
    }
    const user = {id: userId, ws}
    this.users[userId] = user
    debug(`A new user logged in, total user: ${Object.values(this.users).length}`)
    const room = this.findNextAvailableRoom()
    room.addUser(user)
    user.room = room
    this.rooms.push(room)
    return room
  }

  getRoomByUserId(userId) {
    const user = this.users[userId]
    return user && user.room
  }

  findNextAvailableRoom() {
    let availableRoom = null
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].isAvailableToJoin()) {
        availableRoom = this.rooms[i]
        return availableRoom
      }
    }
    return new Room()
  }
}

export default new ArenaService()