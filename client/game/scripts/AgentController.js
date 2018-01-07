import * as glm from '../commons/libs/gl-matrix'
import timeManager from '../commons/managers/timeManager'
import inputManager from '../commons/managers/inputManager'
import GameComponent from '../commons/GameComponent'
import socketService from '../services/socketService'
import serverConfig from '../../../server/config'


class AgentController extends GameComponent {
  constructor(owner) {
    super(owner)
  }

  init() {
  }

  update() {
  }

  doRotate(deltaTime) {
  }

  doMove(deltaTime) {
  }
}

export default AgentController