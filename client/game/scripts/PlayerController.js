import * as glm from '../commons/libs/gl-matrix'
import timeManager from '../commons/managers/timeManager'
import inputManager from '../commons/managers/inputManager'
import GameComponent from '../commons/GameComponent'
import socketService from '../services/socketService'
import serverConfig from '../../../server/config'


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner)
    this.broadcastInterval = serverConfig.broadcastInterval
    this.directInput = { x: 0, y: 0 }
    this.originalPos = this.owner.transform.position
    this.tentativePos = this.owner.transform.position
    this.targetPos = this.owner.transform.position
    this.targetAnimationStart = timeManager.getTimeElapsed()
    this.isGround = false
    this.moveSpeed = 3
    this.rotationSpeed = 120

    this.serverEventHandler = this.serverEventHandler.bind(this)
  }

  init() {
    socketService.register(this.owner.id, this.serverEventHandler)
    this.joinGame()
  }

  joinGame() {
    socketService.post('/login', this.owner.id)
  }

  serverEventHandler(cmd) {
    console.log('receives CMD: ', cmd);
    if (cmd.ownerId === this.owner.id) {
      this.originalPos = this.owner.transform.position;
      this.targetPos = this.tentativePos = cmd.data
      this.targetAnimationStart = timeManager.getTimeElapsed()
    }
  }

  input() {
    this.directInput.x = inputManager.getAxis('Horizontal')
    this.directInput.y = inputManager.getAxis('Vertical')
  }

  enqueue() {
    if (this.directInput.x !== 0 || this.directInput.y !== 0) {
      const newPos = glm.vec3.create()
      glm.vec3.scale(newPos, this.owner.transform.forward, this.directInput.y * this.moveSpeed * this.broadcastInterval / 1000)
      glm.vec3.add(newPos, this.tentativePos, newPos)
      this.tentativePos = newPos
      socketService.enqueueCmd({
        ownerId: this.owner.id,
        type: 'move',
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

  doMove(deltaTime) {
    // no move forward if the slope is too deep
    //if (groundAngle >= maxSlope) return;
    // no move forward if there's an obstacle in front
    // if (Physics.Raycast(transform.position, forward, out forwardRay, 1, groundLayer)) {
    //   Debug.Log(Vector3.Distance(targetPos, forwardRay.point));
    //   if (Vector3.Distance(targetPos, forwardRay.point) < width) return;
    // }
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

export default PlayerController