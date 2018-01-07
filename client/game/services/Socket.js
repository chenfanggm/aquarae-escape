import config from '../config'


class Socket {
  constructor() {
    this.isAlive = false
    this.listeners = {}
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
        let data = null
        try {
          data = JSON.parse(message.data)
        } catch (err) {
          data = message.data
        }

        if (data.data) {
          const commands = data.data;
          commands.forEach((cmd) => {
            const ownerId = cmd.ownerId;
            if (ownerId)  {
              if (this.listeners[ownerId]) {
                this.listeners[ownerId].forEach((listener) => {
                  listener(cmd)
                })
              }
            }
          })
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

  send(message) {
    this.checkConnection()
      .then(() => {
        this.ws.send(message)
      })
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
