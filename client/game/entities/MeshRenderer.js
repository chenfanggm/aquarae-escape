import * as glm from '../libs/gl-matrix';
import GameComponent from './GameComponent';


class MeshRenderer extends GameComponent {
  constructor(owner) {
    super(owner);
    this.mesh = owner.mesh;
    this.material = owner.material;
    this.modelMatrix = glm.mat4.create();
    this.viewMatrix = glm.mat4.create();
    this.projMatrix = glm.mat4.create();
    this.ambientIntensity = [0.2, 0.2, 0.2];
    this.sunDirection = [3.0, 3.0, 3.0];
    this.sunIntensity = [0.9, 0.9, 0.9];
  }

  init() {
    this.bindBufferData();
    this.clear();
  }

  render() {
    this.bindBufferData();
    // setup matrix
    this.computeMatrix();
    // draw
    this.gl.drawElements(this.mesh.primitiveType, this.mesh.indices.length, this.gl.UNSIGNED_SHORT, 0);
    this.clear();
  }

  clear() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.material.program.disable();
  }

  bindBufferData() {
    // vertex
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW);
    this.material.program.enableAttr('vertPosition', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0);
    // indices
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW);
    // uvs
    if (this.mesh.uvs) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.uvBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.uvs), this.gl.STATIC_DRAW);
      this.material.program.enableAttr('vertTexCoord', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 2, 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.mesh.texBuffer);
      this.gl.activeTexture(this.gl.TEXTURE0);
    }
    // bind normal
    if (this.mesh.normals) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.normalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.gl.STATIC_DRAW);
      this.material.program.enableAttr('vertNormal', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0, this.gl.TRUE);
    }
  }

  computeMatrix() {
    this.material.program.enable();
    glm.mat4.identity(this.modelMatrix);
    glm.mat4.mul(this.modelMatrix, this.modelMatrix, this.owner.transform.getTransformMatrix());
    glm.mat4.lookAt(this.viewMatrix, new Float32Array([0, 15, 15]), [0, 0, 0], [0, 1, 0]);
    glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width / aquarae.canvas.height, 0.1, 1000.0);
    this.material.program.setMatrixUniform('modelMatrix', this.modelMatrix);
    this.material.program.setMatrixUniform('viewMatrix', this.viewMatrix);
    this.material.program.setMatrixUniform('projMatrix', this.projMatrix);
    this.material.program.setVec3Uniform('ambientIntensity', this.ambientIntensity);
    this.material.program.setVec3Uniform('sunLight.direction', this.sunDirection);
    this.material.program.setVec3Uniform('sunLight.intensity', this.sunIntensity);
  }
}

export default MeshRenderer;