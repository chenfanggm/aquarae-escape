import * as glm from '../libs/gl-matrix';
import GameComponent from './GameComponent';


class MeshRenderer extends GameComponent {
  constructor(owner, program) {
    super(owner);
    this.program = program;
    this.textureBuffers = [];
    this.modelMatrix = glm.mat4.create();
    this.viewMatrix = glm.mat4.create();
    this.projMatrix = glm.mat4.create();
    this.ambientIntensity = [0.2, 0.2, 0.2];
    this.sunDirection = [3.0, 3.0, 3.0];
    this.sunIntensity = [0.9, 0.9, 0.9];
  }

  init() {
    this.initVAO();
  }

  render() {
    this.program.enable();
    this.textureBuffers.forEach((textureBuffer, index) => {
      this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
    });
    this.gl.bindVertexArray(this.vao);
    this.computeMatrix();
    this.gl.drawElements(this.gl.TRIANGLES, this.owner.mesh.indices.length, this.gl.UNSIGNED_SHORT, 0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindVertexArray(null);
    this.program.disable();
  }

  initVAO() {
    // vao
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // vertex
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.owner.mesh.vertices), this.gl.STATIC_DRAW);
    this.program.enableAttr('vPosition', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0);

    // indices
    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.owner.mesh.indices), this.gl.STATIC_DRAW);

    // uvs
    if (this.owner.mesh.uvs) {
      const uvBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.owner.mesh.uvs), this.gl.STATIC_DRAW);
      this.program.enableAttr('vTexture', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    }

    // normal
    if (this.owner.mesh.normals) {
      const normalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.owner.mesh.normals), this.gl.STATIC_DRAW);
      this.program.enableAttr('vNormal', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0);
    }

    // textures
    if (this.owner.textures) {
      this.owner.textures.forEach((texture) => {
        const textureBuffer = this.gl.createTexture();
        this.textureBuffers.push(textureBuffer);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, texture.isFlipY || false);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texture.data.width, texture.data.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      });
    }

    // clean
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  computeMatrix() {
    glm.mat4.identity(this.modelMatrix);
    glm.mat4.mul(this.modelMatrix, this.modelMatrix, this.owner.transform.getTransformMatrix());
    glm.mat4.lookAt(this.viewMatrix, new Float32Array([0, 15, 15]), [0, 0, 0], [0, 1, 0]);
    glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width / aquarae.canvas.height, 0.1, 1000.0);
    this.program.setMatrixUniform('modelMatrix', this.modelMatrix);
    this.program.setMatrixUniform('viewMatrix', this.viewMatrix);
    this.program.setMatrixUniform('projMatrix', this.projMatrix);
    this.program.setVec3Uniform('ambientIntensity', this.ambientIntensity);
    this.program.setVec3Uniform('sunLight.direction', this.sunDirection);
    this.program.setVec3Uniform('sunLight.intensity', this.sunIntensity);
  }
}

export default MeshRenderer;