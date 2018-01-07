import config from '../config'


class Socket {
  constructor() {
    this.isAlive = false
    this.listeners = {}
    this.generalListeners = []
    this.callbacks = {}
  }

  init() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${config.server.protocol}://${config.server.host}:${config.server.port}`)
      this.ws.onopen = () => {
        console.log('ws is opened!')
        this.isAlive = true
        resolve(this.ws)
      }

      this.ws.onmessage = (message) => {
        let payload = null
        try {
          payload = JSON.parse(message.data)
        } catch (err) {
          payload = message.data
        }

        if (payload.type === 'cmd') {
          const commands = payload.data;
          commands.forEach((cmd) => {
            this.generalListeners.forEach((listener) => {
              listener(cmd)
            })
            const ownerId = cmd.ownerId;
            if (ownerId)  {
              if (this.listeners[ownerId]) {
                this.listeners[ownerId].forEach((listener) => {
                  listener(cmd)
                })
              }
            }
          })
        } else if (payload.type === 'api' && this.callbacks[payload.id]) {
          this.callbacks[payload.id](payload.data)
          delete this.callbacks[payload.id]
        }
      }

      this.ws.onerror = (err) => {
        console.log(err)
        this.isAlive = false
      }
      this.ws.onclose = () => {
        console.log('ws is closed!')
        this.isAlive = false
      }
    })

  }

  registerCallback(id, cb) {
    this.callbacks[id] = cb
    setTimeout(() => {
      delete this.callbacks[id]
    }, 1000)
  }


  sendCMD(message) {
    console.log('sending cmd: ', message)
    this.checkConnection()
      .then(() => {
        this.ws.send(message)
      })
  }

  sendAPI(id, message, cb) {
    this.checkConnection()
      .then(() => {
        this.ws.send(message)
      })
    if (cb) {
      this.registerCallback(id, cb)
    }
  }

  checkConnection() {
    return Promise.resolve()
      .then(() => {
        if (!this.isAlive) {
          return this.init()
        }
      })
  }
}

export default Socket
