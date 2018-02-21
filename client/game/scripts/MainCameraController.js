import * as glm from '../libs/gl-matrix';
import timeManager from '../managers/timeManager';
import GameComponent from '../entities/GameComponent';
import utils from '../entities/utils';
import inputManager from "../managers/inputManager";


class MainCameraController extends GameComponent {
  constructor(owner) {
    super(owner);
    this.directInput = { x: 0, y: 0 };
    this.originalPos = this.owner.transform.position;
    this.tentativePos = this.owner.transform.position;
    this.targetPos = this.owner.transform.position;
    this.targetAnimationStart = timeManager.getTimeElapsed();
    this.moveSpeed = 3;
    this.rotationSpeed = 120;
  }

  input() {
    this.directInput.x = inputManager.getAxis('ViceHorizontal');
    this.directInput.y = inputManager.getAxis('ViceVertical');
  }

  update() {
    const deltaTime = timeManager.getDeltaTime();
    if (this.directInput.x !== 0 || this.directInput.y !== 0) {
      const newPos = glm.vec3.create();
      glm.vec3.scale(newPos, this.owner.transform.forward, this.directInput.y * this.moveSpeed * this.SERVER_BROADCAST_INTERVAL / 1000);
      glm.vec3.add(this.targetPos, this.targetPos, newPos);
      glm.vec3.scale(newPos, this.owner.transform.right, this.directInput.x * this.moveSpeed * this.SERVER_BROADCAST_INTERVAL / 1000);
      glm.vec3.add(this.targetPos, this.targetPos, newPos);
    }
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

export default MainCameraController;
