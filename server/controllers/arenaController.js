import arenaService from '../services/arenaService'


module.exports = [{
  path: '/login',
  method: 'POST',
  handler: (ws, apiMeta) => {
    const userId = apiMeta.data
    const room = arenaService.addNewUserToRoom(ws, userId)
    const userIds = Object.values(room.users).map((user) => {
      return {
        id: user.id,
        position: [3, 0.5, 3]
      }
    })
    ws.send(JSON.stringify({
      type: 'api',
      id: apiMeta.id,
      data: {
        users: userIds
      }
    }))
  }
}]