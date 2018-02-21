import * as glm from '../libs/gl-matrix';
import timeManager from '../managers/timeManager';
import GameComponent from '../entities/GameComponent';
import socketService from '../services/socketService';
import utils from '../entities/utils';


class AgentController extends GameComponent {
  constructor(owner) {
    super(owner);
    this.originalPos = this.owner.transform.position;
    this.targetPos = this.originalPos;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.isGround = false;
    this.receivedUserCMDHandler = this.receivedUserCMDHandler.bind(this);
  }

  init() {
    socketService.registerUserCMDHandler(this.owner.id, this.receivedUserCMDHandler);
  }

  receivedUserCMDHandler(cmd) {
    switch (cmd.type) {
      case 'move':
        this.originalPos = this.owner.transform.position;
        this.targetPos = cmd.data.position;
        const q = cmd.data.orientation;
        this.owner.transform.rotation = q; // is a Quaternion
        glm.mat4.fromQuat(this.owner.transform.rotationMatrix, q);
        this.targetAnimationStart = timeManager.getTimeElapsed();
        break;
      default:
        break;
    }
  }

  update() {
    const deltaTime = timeManager.getDeltaTime();
    this.doRotate(deltaTime);
    this.doMove();
  }

  doRotate(deltaTime) {}

  doMove() {
    const diff = glm.vec3.create();
    glm.vec3.subtract(diff, this.targetPos, this.owner.transform.position);
    glm.vec3.normalize(diff, diff);
    const animationCompletion = utils.getAnimationCompletion(this.targetAnimationStart);
    const targetPos = glm.vec3.create();
    const p0 = glm.vec3.create();
    const p1 = glm.vec3.create();
    glm.vec3.mul(p0, glm.vec3.fromValues(1.0 - animationCompletion, 1.0 - animationCompletion, 1.0 - animationCompletion), this.originalPos);
    glm.vec3.mul(p1, glm.vec3.fromValues(animationCompletion, animationCompletion, animationCompletion), this.targetPos);
    glm.vec3.add(targetPos, p0, p1);
    this.owner.setPosition(targetPos);
  }
}

export default AgentController;
