import sceneManager from './managers/sceneManager'
import timeManager from './managers/timeManager'
import objectManager from './managers/objectManager'
import shaderManager from './managers/shaderManager'
import resourceManager from './managers/resourceManager'
import inputManager from './managers/inputManager'
import utils from './utils'


class Game {
  constructor({gl, canvas}) {
    this.gl = gl
    this.canvas = canvas
    this.fps = 40
    this.frameTimePerUpdate = 1000 / this.fps
    this.prevTime = this.nowTime = 0
    this.runningLoop = null
    // default meta
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.bgColor = 0xFFFFFF
    this.loop = this.loop.bind(this)
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
        window.requestAnimationFrame(this.loop)
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

  loop(timestamp) {
    timeManager.setNowTime(timestamp)
    if (timeManager.getDeltaTime() > this.frameTimePerUpdate) {
      this.input()
      this.update()
      this.render()
      timeManager.updateTimer(timestamp)
    }
    this.runningLoop = window.requestAnimationFrame(this.loop)
  }

  input() {
    sceneManager.getCurScene().input()
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