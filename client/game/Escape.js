import sceneManager from './managers/sceneManager'
import shaderManager from './managers/shaderManager'
import objectManager from './managers/objectManager'
import socketService from './services/socketService'
import Game from './commons/Game'
import MainScene from './scenes/MainScene'
import ShaderProgram from './commons/ShaderProgram'
import simpleDiffuseShader from './shaders/simpleDiffuseShader'
import simpleStandardShader from './shaders/simpleStandardShader'


class Escape extends Game {
  init() {
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.bgColor = 0xC2C3C4
    sceneManager.setCurScene(new MainScene('mainScene'))
    shaderManager.register([
      new ShaderProgram(simpleStandardShader),
      new ShaderProgram(simpleDiffuseShader)
    ])
    super.init()

    socketService.init()
      .then(() => {
        return this.loginServer()
      })
      .then((users) => {
        users.forEach((user) => {
          sceneManager.getCurScene().spawnOtherPlayer(user)
        })
      })
      .then(() => {
        this.loop()
      })
  }

  loginServer() {
    return new Promise((resolve, reject) => {
      const player = objectManager.get('player')
      socketService.post('/login', player.id, (data) => {
        console.log(data)
        if (data.users) {
          console.log('Player is logged in!')
          player.isAuthenticated = true
          resolve(data.users)
        } else {
          reject('Failed to login user.')
        }
      })
    })
  }
}

export default Escape