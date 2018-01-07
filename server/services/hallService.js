import _debug from 'debug'
import config from '../config'
import Room from './Room'

const debug = _debug('app:hall')
class HallService {
  constructor() {
    this.users = {}
    this.rooms = {}
    this.userToRooms = {}
    this.USER_PER_ROOM = config.userNumPerRoom
  }

  addNewUser(ws, userId) {
    const user = {userId, ws}
    this.users[userId] = user
    debug(`a new user logged in, total user: ${Object.values(this.users).length}`)
    const room = this.findNextAvailableRoom()
    room.addUser(user)
    user.roomId = room.getId()
    this.userToRooms[user.userId] = room
    return room.getId()
  }

  getRoomByUserId(userId) {
    return this.userToRooms[userId]
  }

  getRoomById(roomId) {
    return this.rooms[roomId]
  }

  findNextAvailableRoom() {
    let availableRoom = null
    const rooms = Object.values(this.rooms)
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].isAvailableToJoin()) {
        availableRoom = rooms[i]
        break
      }
    }
    if (availableRoom) {
      return availableRoom
    }
    const newRoom = new Room()
    this.rooms[newRoom.getId()] = newRoom
    return newRoom
  }
}

export default new HallService()