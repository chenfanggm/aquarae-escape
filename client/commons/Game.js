import stateManager from './managers/stateManager'
import objectManager from './managers/objectManager'
import sceneManager from './managers/sceneManager'
import utils from './utils'


class Game {
  constructor() {
    this.gl = aquarae.gl
    this.canvas = aquarae.canvas
    this.runningLoop = null
    // default meta
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.bgColor = 0xFFFFFF

    this.loop = this.loop.bind(this)
  }

  reload() {
    this.reset()
    this.start()
  }

  start() {
    this.init()
    this.loop(0)
    console.info('Game started...')
  }

  init() {
    this.setupEnv()
    sceneManager.getCurScene().init()
    this.update()
    this.render()
    this.clear()
  }

  loop(timestamp) {
    stateManager.setTime(timestamp)
    this.update()
    this.render()
    this.clear()
    this.runningLoop = window.requestAnimationFrame(this.loop)
  }

  update() {
    sceneManager.getCurScene().update()
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    sceneManager.getCurScene().render()
  }

  clear() {
    stateManager.resetDelta()
  }

  reset() {
    // clean animation
    if (this.runningLoop) {
      cancelAnimationFrame(this.runningLoop)
    }
    // clear manager
    objectManager.reset()
    sceneManager.reset()
  }

  setupEnv() {
    this.setSize(this.width, this.height)
    this.setClearColor(this.bgColor, 1)
    this.gl.enable(this.gl.DEPTH_TEST)
  }

  setSize(width, height) {
    this.width = width
    this.height = height
    this.gl.viewport(0, 0, this.width, this.height)
  }

  setClearColor(colorHex = '0xFFFFFF', alpha = 1.0) {
    const rgb = utils.hexToRGB(colorHex)
    const rgba = [...rgb, alpha]
    this.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3])
  }
}


export default Game