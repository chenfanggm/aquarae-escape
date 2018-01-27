import * as glm from '../libs/gl-matrix'
import GameComponent from './GameComponent'
import gameManager from '../managers/gameManager'
import shaderManager from '../managers/shaderManager'

class GuiRenderer {
  constructor() {
    this.projMatrix = glm.mat4.create()
    this.game = gameManager.getGame()
    this.program = shaderManager.get('bitmapFontShader')

    this.vertexBuffer = this.gl.createBuffer();
    this.L = 1;
  }

  init() {
    this.bindBufferData()
    this.clear()
  }

  render() {
    this.bindBufferData()
    // setup matrix
    this.computeMatrix()
    // draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.L*6);
    this.clear()
  }

  clear() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.material.program.disable()
  }

  bindBufferData() {
    // vertex
    const x0 = 0, x1 = x0 + 12, y0 = 0, y1 = y0 + 16;
    const v = [ x0,y0,  x1,y0,  x1,y1,  x0,y0,  x1,y1,  x0,y1 ];

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(v), this.gl.STATIC_DRAW)
    this.material.program.enableAttr('coord', this.gl.FLOAT, 2, 0, 0)
  }

  computeMatrix() {
    this.material.program.enable()
    glm.mat4.identity(this.modelMatrix)
    glm.mat4.ortho(this.projMatrix, 0, this.game.width, 0, this.game.height)
    var xy = glm.vec2.fromValues(16, 16);
    this.material.program.setMatrixUniform('projection', this.projMatrix)
    this.material.program.setVec2Uniform('screenXY', xy);
  }
}

export default GuiRenderer
