import arenaService from '../services/arenaService'


module.exports = [{
  path: '/login',
  method: 'POST',
  handler: (ws, userId) => {
    arenaService.addUser(ws, userId)
    ws.send('user login successfully')
  }
}]