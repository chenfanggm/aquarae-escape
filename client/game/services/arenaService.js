import SocketService from './SocketService'


class ArenaService extends SocketService {
  loginUser(name) {
    this.post('/login', name)
  }
}


export default new ArenaService()