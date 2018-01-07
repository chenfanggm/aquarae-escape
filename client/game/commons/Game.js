import sceneManager from './managers/sceneManager'
import roomManager from './managers/roomManager'
import timeManager from './managers/timeManager'
import objectManager from './managers/objectManager'
import shaderManager from './managers/shaderManager'
import resourceManager from './managers/resourceManager'
import inputManager from './managers/inputManager'
import socketService from '../services/socketService'
import utils from './utils'
import config from '../config'


class Game {
  constructor({gl, canvas}) {
    this.gl = gl
    this.canvas = canvas
    this.frameTimePerUpdate = 1000 / config.game.renderFPS
    this.logicTimePerUpdate = 1000 / config.game.logicFPS
    this.prevTime = this.nowTime = 0
    this.runningLoop = null
    this.runningLogicLoop = null
    // default meta
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.bgColor = 0xFFFFFF
    this.renderLoop = this.renderLoop.bind(this)
    this.logicLoop = this.logicLoop.bind(this)
  }

  preloadResource() {
    const resourcesToLoad = [
      //resourceManager.loadText()
    ]
    return Promise.all(resourcesToLoad)
  }

  start() {
    this.preloadResource()
      .then(() => {
        this.init()
        window.requestAnimationFrame(this.logicLoop)
        window.requestAnimationFrame(this.renderLoop)
        console.info('Game started...')
      })
  }

  reload() {
    this.reset()
    this.start()
  }

  init() {
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.frontFace(this.gl.CCW)
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.CULL_FACE)
    this.setSize(this.width, this.height)
    this.setClearColor(this.bgColor, 1)
    inputManager.init()
    sceneManager.init()
  }

  logicLoop(timestamp) {
    timeManager.setNowTime(timestamp)
    if (timeManager.getLogicDeltaTime() > this.logicTimePerUpdate) {
      const roomId = roomManager.getCurRoomId()
      if (roomId) {
        this.sendCmd(roomId)
      }
      timeManager.updateLogicTimer(timestamp)
    }
    this.runningLogicLoop = window.requestAnimationFrame(this.logicLoop)
  }

  renderLoop(timestamp) {
    timeManager.setNowTime(timestamp)
    if (timeManager.getDeltaTime() > this.frameTimePerUpdate) {
      this.input()
      this.enqueue()
      this.update()
      this.render()
      timeManager.updateTimer(timestamp)
    }
    this.runningLoop = window.requestAnimationFrame(this.renderLoop)
  }

  sendCmd(roomId) {
    socketService.flushCmd(roomId)
  }

  input() {
    sceneManager.getCurScene().input()
  }

  enqueue() {
    sceneManager.getCurScene().enqueue()
  }

  update() {
    sceneManager.getCurScene().update()
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    sceneManager.getCurScene().render()
  }

  reset() {
    // reset animation
    if (this.runningLoop) {
      cancelAnimationFrame(this.runningLoop)
    }
    if (this.runningLogicLoop) {
      cancelAnimationFrame(this.runningLoop)
    }
    // reset manager
    objectManager.reset()
    sceneManager.reset()
    timeManager.reset()
    shaderManager.reset()
  }

  setSize(width, height) {
    this.width = width
    this.height = height
    this.gl.viewport(0, 0, this.width, this.height)
  }

  setClearColor(colorHex = '0xFFFFFF', alpha = 1.0) {
    const rgb = utils.hexToRGB(colorHex)
    const rgba = [...rgb, alpha]
    this.gl.clearColor(rgba[0]/255, rgba[1]/255, rgba[2]/255, rgba[3])
  }
}


export default Game