import objectManager from './managers/objectManager'
import sceneManager from './managers/sceneManager'
import Renderer from './Renderer';


class Game {
  constructor(opts = {}) {
    const { canvas, gl } = opts
    // meta
    this.canvas = canvas
    this.renderer = new Renderer(gl)
    this.runningLoop = null

    this.width = this.canvas.width / 1.2
    this.height = this.canvas.height / 1.2
    this.devicePixelRatio = window.devicePixelRatio || 1
    this.bgColor = 0xDDDDDD

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
    // renderer
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(this.bgColor, 1)
    // scene
    sceneManager.getCurScene().init()
    this.update()
    this.render()
    this.canvas.appendChild(this.renderer.domElement)
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
    const curScene = sceneManager.getCurScene()
    curScene.render()
    this.renderer.render()
  }

  clear() {
    // clean animation
    if (this.runningLoop) {
      cancelAnimationFrame(this.runningLoop)
    }

    // clear scene
    const curScene = sceneManager.getCurScene()
    if (curScene) {
      curScene.clear()
    }

    // clean canvas
    if (this.canvas.childNodes[0]) {
      this.canvas.removeChild(this.canvas.childNodes[0])
    }
  }
}


export default Game