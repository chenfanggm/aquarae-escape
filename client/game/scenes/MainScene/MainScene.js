import socketService from '../../services/socketService';
import Scene from '../../entities/Scene';
import Hero from '../../objects/Hero';
import Cube from '../../objects/Cube';
import PlayerController from '../../scripts/PlayerController';
import AgentController from '../../scripts/AgentController';
import gameManager from '../../managers/gameManager';
import meta from './meta';


class MainScene extends Scene {
  constructor() {
    super('mainScene', meta);
    this.receivedCMDHandler = this.receivedCMDHandler.bind(this);
  }

  preload() {
    return super.preload();
  }

  init() {
    socketService.registerCMDHandler(this.receivedCMDHandler);
    super.init();
  }

  receivedCMDHandler(cmd) {
    switch (cmd.type) {
      case 'spawn': {
        const player = gameManager.getGame().getCurPlayer();
        if (cmd.userId !== player.id) {
          console.log('Received CMD spawn:', cmd);
          this.spawnOtherPlayer({ id: cmd.userId, position: cmd.data.position });
        }
      }
        break;
    }
  }

  spawnPlayer({ id, position }) {
    const player = new Hero({
      id,
      name: 'player',
      transform: { position }
    });
    player.addComponent(new PlayerController(player));
    player.init();
    this.addChild(player);
    console.log('Player spawned!', player.id);
  }

  spawnOtherPlayer({ id, position }) {
    const spawned = new Cube({
      id,
      transform: { position }
    });
    spawned.addComponent(new AgentController(spawned));
    spawned.init();
    this.addChild(spawned);
    console.log('One another player spawned!', spawned.id);
  }
}

export default MainScene;