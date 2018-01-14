import * as glm from '../libs/gl-matrix'
import timeManager from '../managers/timeManager'
import inputManager from '../managers/inputManager'
import GameComponent from '../entities/GameComponent'
import socketService from '../services/socketService'
import utils from '../entities/utils'


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner)
    this.directInput = { x: 0, y: 0 }
    this.originalPos = this.owner.transform.position
    this.tentativePos = this.owner.transform.position
    this.targetPos = this.owner.transform.position
    this.targetAnimationStart = timeManager.getTimeElapsed()
    this.isGround = false
    this.moveSpeed = 3
    this.rotationSpeed = 120
    this.receivedUserCMDHandler = this.receivedUserCMDHandler.bind(this)
  }

  init() {
    socketService.registerUserCMDHandler(this.owner.id, this.receivedUserCMDHandler)
  }

  receivedUserCMDHandler(cmd) {
    switch (cmd.type) {
      case 'move':
        this.originalPos = this.owner.transform.position
        this.targetPos = this.tentativePos = cmd.data
        this.targetAnimationStart = timeManager.getTimeElapsed()
        break
      default:
        break
    }
  }

  input() {
    this.directInput.x = inputManager.getAxis('Horizontal')
    this.directInput.y = inputManager.getAxis('Vertical')
  }

  enqueue() {
    if (this.directInput.x !== 0 || this.directInput.y !== 0) {
      const newPos = glm.vec3.create()
      glm.vec3.scale(newPos, this.owner.transform.forward, this.directInput.y * this.moveSpeed * this.SERVER_BROADCAST_INTERVAL / 1000)
      glm.vec3.add(newPos, this.tentativePos, newPos)
      this.tentativePos = newPos
      socketService.enqueueCmd({
        type: 'move',
        userId: this.owner.id,
        data: newPos
      })
    }
  }

  update() {
    const deltaTime = timeManager.getDeltaTime()
    this.doRotate(deltaTime)
    this.doMove(deltaTime)
  }

  doRotate(deltaTime) {
    this.owner.transform.rotate([0, -this.directInput.x * this.rotationSpeed * deltaTime / 1000, 0])
  }

  doMove() {
    const diff = glm.vec3.create()
    glm.vec3.subtract(diff, this.targetPos, this.owner.transform.position)
    glm.vec3.normalize(diff, diff)

    const animationCompletion = utils.getAnimationCompletion(this.targetAnimationStart)
    const targetPos = glm.vec3.create()
    const p0 = glm.vec3.create()
    const p1 = glm.vec3.create()
    glm.vec3.mul(p0, glm.vec3.fromValues(1.0 - animationCompletion, 1.0 - animationCompletion, 1.0 - animationCompletion), this.originalPos)
    glm.vec3.mul(p1, glm.vec3.fromValues(animationCompletion, animationCompletion, animationCompletion), this.targetPos)
    glm.vec3.add(targetPos, p0, p1);
    this.owner.transform.setPosition(targetPos)
  }
}

export default PlayerController