class RoomManager {
  constructor() {
    this.curRoomId = null
  }

  setCurRoomId(roomId) {
    return this.curRoomId = roomId
  }

  getCurRoomId() {
    return this.curRoomId
  }
}

const roomManager = new RoomManager()
export default roomManager