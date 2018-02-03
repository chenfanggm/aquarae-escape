class Shader {
  constructor(source, type) {
    this.gl = aquarae.gl;
    this.shader = this.gl.createShader(type);
    this.gl.shaderSource(this.shader, source);
    this.gl.compileShader(this.shader);
    if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS))
      throw this.gl.getShaderInfoLog(this.shader);
  }
  
  getIdentity() {
    return this.shader;
  }
}

export default Shader;