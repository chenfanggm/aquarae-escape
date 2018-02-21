import serverConfig from '../../../server/config';
import gameManager from '../managers/gameManager';


class GameComponent {

  constructor(owner) {
    this.gl = aquarae.gl;
    this.owner = owner;
    this.game = gameManager.getGame();
    this.SERVER_BROADCAST_INTERVAL = serverConfig.SERVER_BROADCAST_INTERVAL;
  }

  init() {

  }

  input() {

  }

  enqueue() {

  }

  update() {

  }

  render() {

  }

  reset() {

  }

}


export default GameComponent;