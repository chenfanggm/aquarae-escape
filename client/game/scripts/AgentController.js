import * as glm from '../libs/gl-matrix';
import timeManager from '../managers/timeManager';
import cmdManager from '../managers/cmdManager';
import GameComponent from '../entities/GameComponent';
import utils from '../entities/utils';


class AgentController extends GameComponent {
  constructor(owner) {
    super(owner);
    this.receivedInput = { x: 0, y: 0 };
    this.originalPos = this.owner.transform.position;
    this.targetPos = this.originalPos;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.isGround = false;
    this.moveSpeed = 3;
    this.rotationSpeed = 120;
    this.receivedUserCMDHandler = this.receivedUserCMDHandler.bind(this);
  }

  init() {
    cmdManager.registerUserCMDHandler(this.owner.id, this.receivedUserCMDHandler);
  }

  receivedUserCMDHandler(cmd) {
    switch (cmd.type) {
      case 'move':
        if (cmd.data.y !== undefined) this.receivedInput.y = cmd.data.y;
        if (cmd.data.x !== undefined) this.receivedInput.x = cmd.data.x;
        break;
      default:
        break;
    }
  }

  update() {
    const deltaTime = timeManager.getDeltaTime();
    this.doRotate(deltaTime);
    this.doMove(deltaTime);
  }

  doRotate(deltaTime) {
    this.owner.transform.rotate([0, -this.receivedInput.x * this.rotationSpeed * deltaTime / 1000, 0]);
  }

  doMove(deltaTime) {
    const newPos = glm.vec3.create();
    glm.vec3.scale(newPos, this.owner.transform.forward, this.receivedInput.y * this.moveSpeed * deltaTime / 1000);
    glm.vec3.add(newPos, newPos, this.owner.transform.position);
    this.owner.setPosition(newPos);

    if(0) {
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
}

export default AgentController;
