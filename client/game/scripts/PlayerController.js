import * as glm from '../../commons/libs/gl-matrix'
import stateManager from '../../commons/managers/stateManager'
import inputManager from '../../commons/managers/inputManager'
import GameComponent from '../../commons/GameComponent'


class PlayerController extends GameComponent {
  constructor(owner) {
    super(owner)
    this.directInput = {
      x: 0,
      y: 0
    }
    this.isGround = false
    this.moveSpeed = 3
    this.rotationSpeed = 120
  }

  input() {
    this.directInput.x = inputManager.getAxis('Horizontal')
    this.directInput.y = inputManager.getAxis('Vertical')
  }

  update() {
    const deltaTime = stateManager.getDeltaTime()
    this.doRotate(deltaTime)
    this.doMove(deltaTime)
  }

  doRotate(deltaTime) {
    this.owner.transform.rotate([0, this.directInput.x * this.rotationSpeed * deltaTime / 1000, 0])
  }

  doMove(deltaTime) {
    // no move forward if the slope is too deep
    //if (groundAngle >= maxSlope) return;
    // no move forward if there's an obstacle in front
    // if (Physics.Raycast(transform.position, forward, out forwardRay, 1, groundLayer)) {
    //   Debug.Log(Vector3.Distance(targetPos, forwardRay.point));
    //   if (Vector3.Distance(targetPos, forwardRay.point) < width) return;
    // }
    glm.vec3.cross(this.owner.transform.forward, this.owner.transform.right, glm.vec3.fromValues(0, -1, 0))
    const targetPos = glm.vec3.create()
    glm.vec3.scale(targetPos, this.owner.transform.forward, this.directInput.y * this.moveSpeed * deltaTime / 1000)
    glm.vec3.add(targetPos, this.owner.transform.position, targetPos)
    //console.log(this.directInput.y )
    //console.log(this.directInput.y * this.moveSpeed * deltaTime)
    console.log(targetPos)
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