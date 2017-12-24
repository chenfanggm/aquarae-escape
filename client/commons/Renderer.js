import utils from './utils'


class Renderer {
  constructor(gl) {
    this.gl = gl
    this.width = null
    this.height = null
    this.rgba = [0, 0, 0, 1]
  }

  render(scene) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.useProgram(scene.program)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, scene.object.vertexBuffer)

    this.gl.drawArrays(scene.object.primitiveType, 0, scene.object.vertexCount)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.useProgram(null)
  }

  setSize(width, height) {
    this.width = width
    this.height = height
    this.gl.viewport(0, 0, this.width, this.height)
  }

  setClearColor(colorHex, alpha = 1.0) {
    const rgb = utils.hexToRGB(colorHex)
    this.rgba = [...rgb, alpha]
    this.gl.clearColor(this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3])
  }
}

export default Renderer