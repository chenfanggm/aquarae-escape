import SocketService from './SocketService'


class GameService extends SocketService {
  sendKeyMap(keymap) {
    this.post('/keymap', keymap)
  }
}


export default new GameService()