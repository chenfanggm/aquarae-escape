import Shader from './Shader';


class ShaderProgram {
  constructor({ id, vSource, fSource }) {
    this.gl = aquarae.gl;
    this.id = id;
    this.uniLocations = {};
    this.attrLocations = {};
    this.program = this.gl.createProgram();
    this.add([new Shader(vSource, this.gl.VERTEX_SHADER), new Shader(fSource, this.gl.FRAGMENT_SHADER)]);
    this.link();
  }

  link() {
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
      throw this.gl.getProgramInfoLog(this.program);

    this.gl.validateProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS))
      throw this.gl.getProgramInfoLog(this.program);
  }

  add(shaders) {
    shaders.forEach((shader) => {
      this.gl.attachShader(this.program, shader.getIdentity());
    });
  }

  enable() {
    this.gl.useProgram(this.program);
  }

  disable() {
    this.gl.useProgram(null);
  }

  enableAttr(attrName, attrType, index, stride, offset, isNormalized = this.gl.FALSE) {
    const attr = this.gl.getAttribLocation(this.program, attrName);
    this.gl.enableVertexAttribArray(attr);
    this.gl.vertexAttribPointer(attr, index, attrType, isNormalized, stride, offset);
  }

  getAttrLocation(attrName) {
    let attrLocation = this.attrLocations[attrName];
    if (!attrLocation) {
      attrLocation = this.gl.getAttribLocation(this.program, attrName);
      this.attrLocations[attrName] = attrLocation;
    }
    return attrLocation;
  }

  setFloatAttr(attrName, value) {
    const attrLocation = this.getAttrLocation(attrName);
    this.gl.vertexAttrib1f(attrLocation, value);
  }

  getUniLocation(uniName) {
    let uniLocation = this.uniLocations[uniName];
    if (!uniLocation) {
      uniLocation = this.gl.getUniformLocation(this.program, uniName);
      this.uniLocations[uniName] = uniLocation;
    }
    return uniLocation;
  }

  setMatrixUniform(uniName, value) {
    const uniLocation = this.getUniLocation(uniName);
    this.gl.uniformMatrix4fv(uniLocation, false, value);
  }

  setFloatUniform(uniName, value) {
    const uniLocation = this.gl.getUniformLocation(this.program, uniName);
    this.gl.uniform1f(uniLocation, value);
  }

  setVec2Uniform(uniName, value) {
    const uniLocation = this.gl.getUniformLocation(this.program, uniName);
    this.gl.uniform2fv(uniLocation, value);
  }

  setVec3Uniform(uniName, value) {
    const uniLocation = this.gl.getUniformLocation(this.program, uniName);
    this.gl.uniform3fv(uniLocation, value);
  }
}

export default ShaderProgram;