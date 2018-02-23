import config from '../client/game/config';


export default {
  userPerRoom: 5,
  SERVER_BROADCAST_INTERVAL: 1000 / config.game.logicFPS
}