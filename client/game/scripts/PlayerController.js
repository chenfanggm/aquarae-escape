import * as glm from '../commons/libs/gl-matrix'
import timeManager from '../commons/managers/timeManager'
import inputManager from '../commons/managers/inputManager'
import GameComponent from '../commons/GameComponent'
import socketService from '../services/socketService'


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner)
    this.directInput = {
      x: 0,
      y: 0
    }

    this.targetPos = this.owner.transform.position
    this.originalPos = this.owner.transform.position
    this.targetAnimationStart = timeManager.getTimeElapsed();

    this.tentativePos = this.owner.transform.position;


    this.isGround = false
    this.moveSpeed = 3
    this.rotationSpeed = 120
    this.cmdHandler = this.cmdHandler.bind(this)
  }

  init() {
    socketService.register(this.owner.id, this.cmdHandler)
    this.joinGame()
  }

  joinGame() {
    socketService.post('/login', this.owner.id)
  }

  cmdHandler(cmd) {
    console.log("PlayerController.cmdHandler receives ", cmd, " action=" + cmd.action + " value=" + cmd.value + " ownerId=" + cmd.ownerId);
    if (cmd.ownerId && (cmd.ownerId == -999 || cmd.ownerId == this.owner.id)) {
      this.originalPos = this.owner.transform.position = this.targetPos;
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
      const UPDATE_INTERVAL = 1000 / 20;
      glm.vec3.scale(newPos, this.owner.transform.forward, this.directInput.y * this.moveSpeed * UPDATE_INTERVAL / 1000)
      glm.vec3.add(newPos, this.tentativePos, newPos)
      this.tentativePos = newPos;
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

  // calForward() {
  //   if (!this.isGrounded) {
  //     forward = transform.forward;
  //     return;
  //   }
  //   forward = Vector3.Cross(transform.right, downRay.normal);
  // }
  //
  // calGroundAngle() {
  //   if (!isGrounded) {
  //     groundAngle = 0;
  //     return;
  //   }
  //   groundAngle = Vector3.Angle(downRay.normal, transform.forward) - 90;
  // }
  //
  // calTargetPos() {
  //   targetPos = transform.position + directionInput.y * forward * moveSpeed * Time.deltaTime;
  // }
  //
  // checkGround() {
  //   if (Physics.Raycast(transform.position, -Vector3.up, out downRay, height + heightPadding, groundLayer)) {
  //     if (Vector3.Distance(targetPos, downRay.point) < height) {
  //       transform.position = Vector3.Lerp(transform.position, transform.position + Vector3.up * height, heightCorrectionRate * Time.deltaTime);
  //     }
  //     isGrounded = true;
  //   } else {
  //     isGrounded = false;
  //   }
  // }
  //
  // applyGravity() {
  //   if (!isGrounded) {
  //     transform.position += Physics.gravity * Time.deltaTime;
  //   }
  // }
  //

  //
  // drawDebugLines() {
  //   if (!isDebug) return;
  //   Debug.DrawLine(transform.position, transform.position + forward * height * 2, Color.blue);
  //   Debug.DrawLine(transform.position, transform.position - Vector3.up * height, Color.green);
  // }
}

export default PlayerController