import uuid from 'uuid/v4'


class Player {
  constructor(opts) {
    this.id = opts.id || uuid()
    this.isConnected = false
  }




}

export default Player