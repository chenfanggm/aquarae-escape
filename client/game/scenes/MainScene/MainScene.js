import gameManager from '../../managers/gameManager';
import cmdManager from '../../managers/cmdManager';
import PlayerController from '../../scripts/PlayerController';
import AgentController from '../../scripts/AgentController';
import MainCameraController from '../../scripts/MainCameraController';
import Scene from '../../entities/Scene';
import Camera from '../../entities/Camera';
import Hero from '../../objects/Hero';
import Cube from '../../objects/Cube';
import DirectLight from '../../entities/DirectLight';
import meta from './meta';


class MainScene extends Scene {
  constructor() {
    super('mainScene');
    this.setMeta(meta);
    this.receivedCMDHandler = this.receivedCMDHandler.bind(this);
  }

  preload() {
    // camera
    const mainCamera = new Camera({
      name: 'mainCamera',
      transform: { position: [0, 15, 15] }
    });
    mainCamera.addComponent(new MainCameraController(mainCamera));
    this.addChild(mainCamera);

    // lights
    const directLight = new DirectLight({
      transform: { position: [15, 15, 15] },
      color: [1, 1, 1],
      intensity: 1
    });
    this.addChild(directLight);

    // objects
    const cube3 = new Cube({
      transform: { position: [1, 1, 0] }
    });
    const cube4 = new Cube({
      transform: { position: [-1, 1, 0] }
    });
    this.addChild(cube3);
    this.addChild(cube4);

    return super.preload()
  }

  init() {
    cmdManager.registerCMDHandler(this.receivedCMDHandler);
    super.init();
  }

  input() {
    super.input();
  }

  receivedCMDHandler(cmd) {
    switch (cmd.type) {
      case 'spawn':
        const player = gameManager.getGame().getCurPlayer();
        if (cmd.userId !== player.id) {
          console.log('[Socket] Received CMD spawn:', cmd);
          this.spawnOtherPlayer({ id: cmd.userId, position: cmd.data.position });
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
    player.spawn();
    this.addChild(player);
    console.log('[Player] Spawned!', player.id);
  }

  spawnOtherPlayer({ id, position }) {
    const spawned = new Cube({
      id,
      transform: { position }
    });
    spawned.addComponent(new AgentController(spawned));
    spawned.spawn();
    this.addChild(spawned);
    console.log('[Player] One another player spawned!', spawned.id);
  }
}

export default MainScene;