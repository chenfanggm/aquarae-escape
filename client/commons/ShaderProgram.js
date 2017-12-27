import Shader from './Shader'


class ShaderProgram {
  constructor({id, vSource, fSource}) {
    this.gl = aquarae.gl
    this.id = id
    this.program = this.gl.createProgram()
    this.add([new Shader(vSource, this.gl.VERTEX_SHADER), new Shader(fSource, this.gl.FRAGMENT_SHADER)])
    this.link()
  }

  link() {
    this.gl.linkProgram(this.program)
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
      throw this.gl.getProgramInfoLog(this.program)

    this.gl.validateProgram(this.program)
    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS))
      throw this.gl.getProgramInfoLog(this.program)
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

  enableAttr(attrName, attrType, index, stride, offset) {
    const attr = this.gl.getAttribLocation(this.program, attrName)
    this.gl.enableVertexAttribArray(attr)
    this.gl.vertexAttribPointer(attr, index, attrType, this.gl.FALSE, stride, offset)
  }

  setFloatAttr(attrName, value) {
    const attr = this.gl.getAttribLocation(this.program, attrName)
    this.gl.vertexAttrib1f(attr, value)
  }

  setMatrixUniform(uniName, value) {
    const uniform = this.gl.getUniformLocation(this.program, uniName)
    this.gl.uniformMatrix4fv(uniform, false, value)
  }

  setFloatUniform(uniName, value) {
    const uniform = this.gl.getUniformLocation(this.program, uniName)
    this.gl.uniform1f(uniform, value)
  }
}

export default ShaderProgram