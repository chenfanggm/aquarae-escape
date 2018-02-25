import arenaService from '../services/arenaService'
import User from '../entities/User'


module.exports = [{
  path: '/login',
  method: 'POST',
  handler: (ws, apiMeta) => {
    const userId = apiMeta.data;
    if (arenaService.getUser(userId)) throw new Error('Logged in as an existing user!');

    const user = new User({
      id: userId,
      position: [3, 0.5, 3]
    });
    user.ws = ws;
    const room = arenaService.addUserToRoom(user);
    const users = Object.values(room.users).map((user) => {
      return {
        id: user.id,
        position: user.position
      }
    });
    ws.send(JSON.stringify({
      type: 'api',
      id: apiMeta.id,
      data: {
        users,
        epoch: room.curEpoch
      }
    }))
  }
}];