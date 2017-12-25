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
    this.clear()
    this.start()
  }

  start() {
    this.init()
    this.loop()
    console.info('Game started...')
  }

  init() {
    this.setSize(this.width, this.height)
    this.setClearColor(this.bgColor, 1)
    sceneManager.getCurScene().init()
    this.update()
    this.render()
  }

  loop() {
    this.update()
    this.render()
    this.runningLoop = window.requestAnimationFrame(this.loop)
  }

  update() {
    sceneManager.getCurScene().update()
  }

  render() {
    // clear viewport
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    // render scene
    sceneManager.getCurScene().render()
  }

  clear() {
    // clean animation
    if (this.runningLoop) {
      cancelAnimationFrame(this.runningLoop)
    }
    // clear manager
    objectManager.clearAll()
    sceneManager.clearAll()
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