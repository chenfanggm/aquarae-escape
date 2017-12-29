import * as glm from './libs/gl-matrix'
import GameComponent from './GameComponent'
import utils from './utils'


class Transform extends GameComponent {
  constructor(owner) {
    super(owner)
    this.origin = glm.vec3.fromValues(0, 0, 0)
    this.position = glm.vec3.fromValues(0, 0, 0)
    this.rotation = glm.quat.create()
    this.scale = glm.vec3.fromValues(1, 1, 1)
    this.tranformMatrix = glm.mat4.create()
  }

  getTransformMatrix() {
    this.tranformMatrix = glm.mat4.fromRotationTranslationScaleOrigin(this.tranformMatrix, this.rotation, this.position, this.scale, this.origin)
    glm.mat4.mul(this.tranformMatrix, this.getParentMatrix(), this.tranformMatrix)
    return this.tranformMatrix
  }

  getParentMatrix() {
    return this.owner.parent && this.owner.parent.transform && this.owner.parent.transform.getTransformMatrix() || glm.mat4.create()
  }

  translate(translates) {
    glm.vec3.add(this.position, this.position, translates)
  }

  rotate(eulerAngles) {
    const rotateQuat = glm.quat.create()
    glm.quat.fromEuler(rotateQuat, eulerAngles[0], eulerAngles[1], eulerAngles[2])
    glm.quat.mul(this.rotation, this.rotation, rotateQuat)
  }
}

export default Transform