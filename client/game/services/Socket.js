import config from '../config'


class Socket {
  constructor() {
    this.isAlive = false
  }

  init() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${config.server.protocol}://${config.server.host}:${config.server.port}`)
      this.ws.onopen = () => {
        console.log('Socket is opened!')
        this.isAlive = true
        resolve(this.ws)
      }
      this.ws.onmessage = (data) => {
        console.log(data)
      }
      this.ws.onerror = (err) => {
        console.log(err)
        this.isAlive = false
      }
      this.ws.onclose = () => {
        console.log('Socket is closed!')
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
    return Promise.resolve(this.ws)
      .then(() => {
        if (!this.isAlive) {
          return this.init()
        }
      })
  }
}

export default Socket
