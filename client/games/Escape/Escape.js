import sceneManager from '../../commons/managers/sceneManager'
import shaderManager from '../../commons/managers/shaderManager'
import Game from '../../commons/Game'
import MainScene from './scenes/MainScene'
import Shader from '../../commons/Shader'
import simpleVertexShader from './shaders/simpleVertexShader'
import simpleFragmentShader from './shaders/simpleFragmentShader'


class Escape extends Game {
  init() {
    // meta
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.bgColor = 0xC2C3C4
    sceneManager.setCurScene(new MainScene('mainScene'))
    shaderManager.register({
      'simpleVertexShader': new Shader(simpleVertexShader, this.gl.VERTEX_SHADER),
      'simpleFragmentShader': new Shader(simpleFragmentShader, this.gl.FRAGMENT_SHADER)
    })
    super.init()
  }

  input() {
    super.input()
  }
}

export default Escape