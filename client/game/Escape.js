import sceneManager from '../commons/managers/sceneManager'
import shaderManager from '../commons/managers/shaderManager'
import Game from '../commons/Game'
import MainScene from './scenes/MainScene'
import ShaderProgram from '../commons/ShaderProgram'
import simpleDiffuseShader from './shaders/simpleDiffuseShader'
import simpleDiffuseShader1 from './shaders/simpleDiffuseShader1'
import simpleStandardShader from './shaders/simpleStandardShader'


class Escape extends Game {
  init() {
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.bgColor = 0xC2C3C4
    sceneManager.setCurScene(new MainScene('mainScene'))
    shaderManager.register([
      new ShaderProgram(simpleStandardShader),
      new ShaderProgram(simpleDiffuseShader),
      new ShaderProgram(simpleDiffuseShader1)
    ])
    super.init()
  }
}

export default Escape