import sceneManager from './commons/managers/sceneManager'
import shaderManager from './commons/managers/shaderManager'
import playerManager from './commons/managers/playerManager'
import roomManager from './commons/managers/roomManager'
import socketService from './services/socketService'
import Game from './commons/Game'
import MainScene from './scenes/MainScene'
import ShaderProgram from './commons/ShaderProgram'
import simpleDiffuseShader from './shaders/simpleDiffuseShader'
import simpleStandardShader from './shaders/simpleStandardShader'
import Cube from './objects/Cube'
import PlayerController from './scripts/PlayerController'


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

    socketService.init()
      .then(() => {
        this.createPlayer()
        this.joinServer()
        super.init()
      })
  }

  createPlayer() {
    const player = new Cube({ position: [-2, 0.5, 2] })
    player.addComponent(new PlayerController(player))
    playerManager.setCurPlayer(player)
  }

  joinServer() {
    const player = playerManager.getCurPlayer()
    socketService.post('/login', player.id, (data) => {
      roomManager.setCurRoomId(data.roomId)
    })
  }
}

export default Escape