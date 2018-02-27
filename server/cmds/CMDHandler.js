import hallService from '../services/arenaService'
import _debug from 'debug'
const debug = _debug('app:cmdHandler');


class CMDHandler {
  constructor() {
    this.handlers = {};
    this.handle = this.handle.bind(this)
  }

  register(handlers) {
    handlers.forEach((handler) => {
      if (this.handlers[handler.type]) throw new Error(`handler already registered: ${handler.type}`);
      this.handlers[handler.type] = handler.handler
    })
  }

  handle(ws, msgMeta) {
    const userId = msgMeta.userId;
    const room = hallService.getRoomByUserId(userId);
    if (room) {
      room.enqueueCMD(msgMeta.data)
    }
  }
}


module.exports = CMDHandler;