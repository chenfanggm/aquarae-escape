import uuid from 'uuid/v4'
import sceneManager from './managers/sceneManager'
import shaderManager from './managers/shaderManager'
import objectManager from './managers/objectManager'
import socketService from './services/socketService'
import Game from './entities/Game'
import MainScene from './scenes/MainScene'
import ShaderProgram from './entities/ShaderProgram'
import Player from './entities/Player'
import simpleDiffuseShader from './shaders/simpleDiffuseShader'
import simpleStandardShader from './shaders/simpleStandardShader'


class Escape extends Game {
  constructor(opts) {
    super(opts)
    this.loginServer = this.loginServer.bind(this)
  }

  init() {
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.bgColor = 0xC2C3C4
    sceneManager.setCurScene(new MainScene('mainScene'))
    shaderManager.register([
      new ShaderProgram(simpleStandardShader),
      new ShaderProgram(simpleDiffuseShader)
    ])
    this.createPlayer()
    super.init()

    socketService.init()
      .then(() => {
        return this.loginServer(this.player)
      })
      .then((users) => {
        const scene = sceneManager.getCurScene()
        users.forEach((user) => {
          if (user.id === this.player.id) {
            scene.spawnPlayer(user)
          } else {
            scene.spawnOtherPlayer(user)
          }
        })
      })
      .then(() => {
        this.loop()
      })
  }

  createPlayer() {
    this.player = new Player({
      id: uuid()
    })
  }

  loginServer(player) {
    return new Promise((resolve, reject) => {
      socketService.post('/login', player.id, (data) => {
        if (data.users) {
          console.log('Player logged in!')
          player.isConnected = true
          resolve(data.users)
        } else {
          reject('Failed to login user.')
        }
      })
    })
  }
}

export default Escape