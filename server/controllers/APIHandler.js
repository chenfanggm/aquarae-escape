const arenaController = require('./arenaController')

class ApiHandler {
  constructor() {
    this.handlers = {}
    this.register(arenaController)
  }

  register(controllers) {
    controllers.forEach((controller) => {
      const hash = `${controller.method}${controller.path}`
      if (this.handlers[hash]) throw new Error(`controller already registered: ${hash}`)
      this.handlers[hash] = controller.handler
    })
  }

  handle(ws, api) {
    const hash = `${api.method}${api.path}`
    if (this.handlers[hash]) {
      this.handlers[hash](ws, api.data)
    }
  }
}


module.exports = ApiHandler