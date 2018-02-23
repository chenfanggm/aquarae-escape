import * as glm from '../libs/gl-matrix';
import KeyCode from 'keycode-js';
import timeManager from '../managers/timeManager';
import inputManager from '../managers/inputManager';
import GameComponent from '../entities/GameComponent';
import socketService from '../services/socketService';
import utils from '../entities/utils';


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner);
    this.directInput = { x: 0, y: 0 };
    this.originalPos = this.owner.transform.position;
    this.tentativePos = this.owner.transform.position;
    this.targetPos = this.owner.transform.position;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.isGround = true;
    this.moveSpeed = 3;
    this.jumpSpeed = 3;
    this.fallSpeed = 3;
    this.rotationSpeed = 120;
    this.receivedUserCMDHandler = this.receivedUserCMDHandler.bind(this);
  }

  init() {
    socketService.registerUserCMDHandler(this.owner.id, this.receivedUserCMDHandler);
  }

  receivedUserCMDHandler(cmd) {
    switch (cmd.type) {
      case 'move':
        this.originalPos = this.owner.transform.position;
        this.targetPos = this.tentativePos = cmd.data.position;
        this.targetAnimationStart = timeManager.getTimeElapsed();
        break;
      default:
        break;
    }
  }

  input() {
    this.directInput.x = inputManager.getAxis('Horizontal');
    this.directInput.y = inputManager.getAxis('Vertical');
    this.directInput.up = inputManager.getKey(KeyCode.KEY_SPACE) ? 1 : 0;
  }

  enqueue() {
    let isDirty = false;
    const newPos = glm.vec3.create();
    const diff = glm.vec3.create();
    const newOrient = this.owner.transform.rotation;

    if (this.isGround && this.directInput.up !== 0) {
      isDirty = true;
      this.isGround = false;
      glm.vec3.scale(diff, this.owner.transform.up , this.directInput.up * this.jumpSpeed);
      glm.vec3.add(newPos, this.tentativePos, diff);
      this.tentativePos = newPos;
    } else if (!this.isGround) {
      isDirty = true;
      glm.vec3.scale(diff, this.owner.transform.up , -this.fallSpeed * this.game.logicTimePerUpdate / 1000);
      glm.vec3.add(newPos, this.tentativePos, diff);
      if (newPos[1] <= 0.5) {
        newPos[1] = 0.5;
        this.isGround = true;
      }
      this.tentativePos = newPos;
    }

    if (this.directInput.x !== 0 || this.directInput.y !== 0) {
      isDirty = true;
      glm.vec3.scale(diff, this.owner.transform.forward, this.directInput.y * this.moveSpeed * this.game.logicTimePerUpdate / 1000);
      glm.vec3.add(newPos, this.tentativePos, diff);
      this.tentativePos = newPos;
    }

    if (isDirty) {
      socketService.enqueueCmd({
        type: 'move',
        userId: this.owner.id,
        data: {
          position: newPos,
          orientation: newOrient
        }
      });
    }
  }

  update() {
    const deltaTime = timeManager.getDeltaTime();
    this.doRotate(deltaTime);
    this.doMove(deltaTime);
  }

  doRotate(deltaTime) {
    this.owner.transform.rotate([0, -this.directInput.x * this.rotationSpeed * deltaTime / 1000, 0]);
  }

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

export default PlayerController;
