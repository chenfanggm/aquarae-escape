import playerHandler from './playerHandler'
import arenaService from '../services/arenaService'


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

  handle(commands) {
    commands.forEach((cmd) => {
      if (this.handlers[cmd.type]) {
        this.handlers[cmd.type](cmd.data)
      }
    })
  }
}



module.exports = CMDHandler