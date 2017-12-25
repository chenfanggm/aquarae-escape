import Game from '../../commons/Game'
import MainScene from './scenes/MainScene'
import sceneManager from '../../commons/managers/sceneManager'


class Escape extends Game {
  init() {
    // meta
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.bgColor = 0xDDDDDD
    sceneManager.setCurScene(new MainScene('mainScene'))
    super.init()
  }
}

export default Escape