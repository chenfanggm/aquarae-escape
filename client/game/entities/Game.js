import timeManager from '../managers/timeManager';
import gameManager from '../managers/gameManager';
import inputManager from '../managers/inputManager';
import sceneManager from '../managers/sceneManager';
import objectManager from '../managers/objectManager';
import shaderManager from '../managers/shaderManager';
import rendererManager from '../managers/rendererManager';
import cmdManager from '../managers/cmdManager';
import socketService from '../services/socketService';
import config from '../config';


class Game {
  constructor({ gl, canvas }) {
    this.gl = gl;
    this.canvas = canvas;
    this.logicTimePerEpoch = 1000 / config.game.logicFPS;
    this.frameTimePerUpdate = 1000 / config.game.renderFPS;
    this.prevTime = this.nowTime = 0;
    this.runningLoop = null;
    this.runningLogicLoop = null;
    // default meta
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    // server related
    this.player = null;
    this.renderLoop = this.renderLoop.bind(this);
    this.logicLoop = this.logicLoop.bind(this);
    gameManager.setGame(this);
  }

  start() {
    this.preload()
      .then(() => {
        console.log('[Game] Initiating...');
        return this.init();
      })
      .then(() => {
        cmdManager.preCatchProcess();
        this.loop();
      });
  }

  preload() {
    console.log('[Game] Pre loading...');
    // game level preload
    return Promise.all([
      //resourceManager.loadText()
    ])
      .then(() => {
        // scene level preload
        return sceneManager.preload();
      })
      .then(() => {
        console.log('[Game] Finish loading!');
      });
  }

  init() {
    this.setWindowSize(this.width, this.height);
    inputManager.init();
    sceneManager.init();
    rendererManager.init();

    return Promise.all([
      socketService.init()
    ])
      .then(() => {
        console.log('[Game] Initiated!');
      });
  }

  loop() {
    window.requestAnimationFrame(this.logicLoop);
    window.requestAnimationFrame(this.renderLoop);
    console.log('[Game] Loop started!');
  }

  logicLoop(timestamp) {
    timeManager.setNowTime(timestamp);
    if (timeManager.getLogicDeltaTime() > this.logicTimePerEpoch) {
      this.sync();
      timeManager.updateLogicTimer(timestamp);
    }
    this.runningLogicLoop = window.requestAnimationFrame(this.logicLoop);
  }

  renderLoop(timestamp) {
    timeManager.setNowTime(timestamp);
    if (timeManager.getDeltaTime() > this.frameTimePerUpdate) {
      this.input();
      this.enqueue();
      this.processServerCMD();
      this.update(timeManager.getDeltaTime());
      this.render();
      timeManager.updateTimer(timestamp);
    }
    this.runningLoop = window.requestAnimationFrame(this.renderLoop);
  }

  sync() {
    if (this.player.isConnected) {
      socketService.flushCmd();
    }
  }

  input() {
    sceneManager.getCurScene().input();
  }

  enqueue() {
    sceneManager.getCurScene().enqueue();
  }

  processServerCMD() {
    cmdManager.process();
  }

  update(deltaTime) {
    console.log('scene', sceneManager.getCurScene())
    sceneManager.getCurScene().update(deltaTime);
  }

  render() {
    rendererManager.render();
  }

  reset() {
    // reset animation
    if (this.runningLoop) {
      cancelAnimationFrame(this.runningLoop);
    }
    if (this.runningLogicLoop) {
      cancelAnimationFrame(this.runningLoop);
    }
    // reset manager
    objectManager.reset();
    sceneManager.reset();
    timeManager.reset();
    shaderManager.reset();
  }

  setWindowSize(width, height) {
    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  getCurPlayer() {
    return this.player;
  }
}


export default Game;
