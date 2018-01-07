import * as glm from '../commons/libs/gl-matrix'
import timeManager from '../commons/managers/timeManager'
import inputManager from '../commons/managers/inputManager'
import GameComponent from '../commons/GameComponent'
import socketService from '../services/socketService'
import serverConfig from '../../../server/config'


class AgentController extends GameComponent {
  constructor(owner) {
    super(owner)
    this.cmdBroadcastInterval = serverConfig.cmdBroadcastInterval;

    this.originalPos = this.owner.transform.position;
    this.targetPos   = this.originalPos;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.roomId = null;

    this.serverCMDHandler = this.serverCMDHandler.bind(this); // what is this for?
  }

  init() {
    socketService.registerUserHandler(this.owner.id, this.serverCMDHandler);
  }

  serverCMDHandler(cmd) {
    console.log('AgentController receives CMD type=', cmd.type);
    switch (cmd.type) {
      case "move":
        if (cmd.ownerId === this.ownerId) {
          this.originalPos = this.owner.transform.position;
          this.targetPos = this.tentativePos = cmd.data;
          this.targetAnimationStart = timeManager.getTimeElapsed();
        }
        break;
    }
  }

  update() {
    const deltaTime = timeManager.getDeltaTime();
    this.doRotate(deltaTime); this.doMove(deltaTime);
  }

  doRotate(deltaTime) {
  }

  doMove(deltaTime) {
    const diff = glm.vec3.create()
    glm.vec3.subtract(diff, this.targetPos, this.owner.transform.position)
    glm.vec3.normalize(diff, diff)

    const UPDATE_INTERVAL = 1000 / 20;
    const timeNow = timeManager.getTimeElapsed()
    let completion = (timeNow - this.targetAnimationStart) / UPDATE_INTERVAL;
    if (completion < 0) completion = 0;
    else if (completion > 1) completion = 1;

    const targetPos = glm.vec3.create();
    const p0 = glm.vec3.create()
    const p1 = glm.vec3.create()
    glm.vec3.mul(p0, glm.vec3.fromValues(1.0-completion, 1.0-completion, 1.0-completion), this.originalPos);
    glm.vec3.mul(p1, glm.vec3.fromValues(completion, completion, completion), this.targetPos);
    glm.vec3.add(targetPos, p0, p1);
    this.owner.transform.setPosition(targetPos)
  }
}

export default AgentController