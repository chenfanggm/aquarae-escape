import * as glm from '../libs/gl-matrix';


class Transform {
  constructor(owner, opts = {}) {
    this.owner = owner;
    this.origin = glm.vec3.fromValues(0, 0, 0);
    this.position = opts.position || glm.vec3.fromValues(0, 0, 0);
    this.rotation = glm.quat.create();
    this.scale = glm.vec3.fromValues(1, 1, 1);
    this.up = glm.vec3.fromValues(0, 1, 0);
    this.right = glm.vec3.fromValues(1, 0, 0);
    this.forward = glm.vec3.fromValues(0, 0, -1);
    this.tranformMatrix = glm.mat4.create();
    this.rotationMatrix = glm.mat4.create();
  }

  translate(translates) {
    glm.vec3.add(this.position, this.position, translates);
  }

  rotate(eulerAngles) {
    const rotateQuat = glm.quat.create();
    glm.quat.fromEuler(rotateQuat, eulerAngles[0], eulerAngles[1], eulerAngles[2]);
    glm.quat.mul(this.rotation, this.rotation, rotateQuat);
    glm.mat4.fromQuat(this.rotationMatrix, rotateQuat);
    glm.vec3.transformMat4(this.forward, this.forward, this.rotationMatrix);
  }

  getMatrix() {
    this.tranformMatrix = glm.mat4.fromRotationTranslationScaleOrigin(this.tranformMatrix, this.rotation, this.position, this.scale, this.origin);
    glm.mat4.mul(this.tranformMatrix, this.getParentMatrix(), this.tranformMatrix);
    return this.tranformMatrix;
  }

  getParentMatrix() {
    return this.owner.parent && this.owner.parent.transform && this.owner.parent.transform.getMatrix() || glm.mat4.create();
  }

  setPosition(pos) {
    this.position = glm.vec3.fromValues(pos[0], pos[1], pos[2]);
  }
}

export default Transform;