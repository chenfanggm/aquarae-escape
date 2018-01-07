import hallService from '../services/hallService'


module.exports = [{
  path: '/login',
  method: 'POST',
  handler: (ws, api) => {
    const roomId = hallService.addNewUser(ws, api.data)
    ws.send(JSON.stringify({
      id: api.id,
      type: 'api',
      data: {
        roomId
      }
    }))
  }
}]