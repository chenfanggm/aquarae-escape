import timeManager from '../managers/timeManager';
import gameManager from '../managers/gameManager';
import inputManager from '../managers/inputManager';
import sceneManager from '../managers/sceneManager';
import objectManager from '../managers/objectManager';
import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import socketService from '../services/socketService';
import utils from './utils';
import config from '../config';


class Game {
  constructor({ gl, canvas }) {
    this.gl = gl;
    this.canvas = canvas;
    this.clearColor = this.getClearColor('0xC3C3C3');
    this.logicTimePerUpdate = 1000 / config.game.logicFPS;
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
    if (timeManager.getLogicDeltaTime() > this.logicTimePerUpdate) {
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
      this.update();
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

  update() {
    sceneManager.getCurScene().update();
  }

  render() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.frontFace(this.gl.CCW);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1.0);
    sceneManager.getCurScene().render();
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

  getClearColor(colorHex = '0xFFFFFF', alpha = 1.0) {
    const rgb = utils.hexToRGB(colorHex);
    const rgba = [...rgb, alpha];
    return [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255];
  }

  getCurPlayer() {
    return this.player;
  }
}


export default Game;
