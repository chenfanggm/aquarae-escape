import * as glm from '../libs/gl-matrix';
import KeyCode from 'keycode-js';
import timeManager from '../managers/timeManager';
import inputManager from '../managers/inputManager';
import cmdManager from '../managers/cmdManager';
import GameComponent from '../entities/GameComponent';
import socketService from '../services/socketService';
import utils from '../entities/utils';


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner);
    this.curDirectInput = this.lastDirectInput = { x: 0, y: 0 };
    this.receivedInput = { x: 0, y: 0 };
    this.originalPos = this.owner.transform.position;
    this.tentativePos = this.owner.transform.position;
    this.targetPos = this.owner.transform.position;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.isGround = true;
    this.moveSpeed = 3;
    this.rotationSpeed = 120;
    this.jumpSpeed = 3;
    this.fallSpeed = 3;
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

  input() {
    this.lastDirectInput = {...this.curDirectInput};
    this.curDirectInput.x = inputManager.getAxis('Horizontal');
    this.curDirectInput.y = inputManager.getAxis('Vertical');
    this.curDirectInput.up = inputManager.getKey(KeyCode.KEY_SPACE) ? 1 : 0;
  }

  enqueue() {
    let isDirty = false;
    const movePayload = {};
    if (this.curDirectInput.x !== this.lastDirectInput.x) {
      isDirty = true;
      movePayload.x = this.curDirectInput.x;
    }

    if (this.curDirectInput.y !== this.lastDirectInput.y) {
      isDirty = true;
      movePayload.y = this.curDirectInput.y;
    }

    if (isDirty) {
      socketService.enqueueCmd({
        type: 'move',
        userId: this.owner.id,
        data: movePayload,
        curEpochOffset: timeManager.getCurEpochOffset()
      });
    }
  }

  update() {
    if (timeManager.getCurEpochOffset() >= 100) return;
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

export default PlayerController;
