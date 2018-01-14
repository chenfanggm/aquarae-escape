const hallController = require('./arenaController')

class ApiHandler {
  constructor() {
    this.handlers = {}
    this.register(hallController)
  }

  register(controllers) {
    controllers.forEach((controller) => {
      const hash = `${controller.method}${controller.path}`
      if (this.handlers[hash]) throw new Error(`controller already registered: ${hash}`)
      this.handlers[hash] = controller.handler
    })
  }

  handle(ws, apiMeta) {
    const hash = `${apiMeta.method}${apiMeta.path}`
    if (this.handlers[hash]) {
      this.handlers[hash](ws, apiMeta)
    }
  }
}

module.exports = ApiHandler