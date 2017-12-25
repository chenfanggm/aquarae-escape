

class ShaderProgram {
  constructor(shaders) {
    this.gl = aquarae.gl
    this.program = this.gl.createProgram()
    if (shaders) {
      this.add(shaders)
    }
  }

  init() {
    this.gl.linkProgram(this.program)
  }

  add(shaders) {
    shaders.forEach((shader) => {
      this.gl.attachShader(this.program, shader.getIdentity())
    })
  }

  enable() {
    this.gl.useProgram(this.program)
  }

  disable() {
    this.gl.useProgram(null)
  }

  enableAttr(attrName, index, stride, offset) {
    const attr = this.gl.getAttribLocation(this.program, attrName)
    this.gl.enableVertexAttribArray(attr)
    this.gl.vertexAttribPointer(attr, index, this.gl.FLOAT, false, stride, offset)
  }

  setFloatAttr(attrName, value) {
    const attr = this.gl.getAttribLocation(this.program, attrName)
    this.gl.vertexAttrib1f(attr, value)
  }

  setMatrix(uniName, value) {
    const uniform = this.gl.getUniformLocation(this.program, uniName)
    this.gl.uniformMatrix4fv(uniform, false, value)
  }
}

export default ShaderProgram