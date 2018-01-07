import playerHandler from './playerHandler'
import hallService from '../services/hallService'


class CMDHandler {
  constructor() {
    this.handlers = {}
    this.register(playerHandler)
    this.handle = this.handle.bind(this)
  }

  register(handlers) {
    handlers.forEach((handler) => {
      if (this.handlers[handler.type]) throw new Error(`handler already registered: ${handler.type}`)
      this.handlers[handler.type] = handler.handler
    })
  }

  handle(msgMeta) {
    const room = hallService.getRoomById(msgMeta.roomId)
    if (room) {
      room.enqueueCmd(msgMeta.data)
    }
  }
}



module.exports = CMDHandler