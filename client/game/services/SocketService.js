import Socket from './Socket'


class SocketService {
  constructor() {
    if (window.aquarae && window.aquarae.ws) {
      this.ws = window.aquarae.ws
    } else {
      window.aquarae = {}
      this.ws = window.aquarae.ws = new Socket()
    }
  }

  post(path, data) {
    this.ws.send(JSON.stringify({
      type: 'api',
      path,
      method: 'POST',
      data
    }))
  }

  retrieve(message) {
    this.ws.send({
      type: 'api',
      method: 'GET',
      msg: message
    })
  }
}

export default SocketService