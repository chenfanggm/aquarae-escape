import socketService from './socketService';


export const loginUser = (player) => {
  return new Promise((resolve, reject) => {
    socketService.post('/login', player.id, (data) => {
      if (data.users) {
        console.log('Player logged in!');
        player.isConnected = true;
        resolve(data.users)
      } else {
        reject('Failed to login user.')
      }
    })
  })
};