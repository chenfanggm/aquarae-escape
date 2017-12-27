import * as glm from '../../../commons/libs/gl-matrix'
import stateManager from '../../../commons/managers/stateManager'
import sceneManager from '../../../commons/managers/sceneManager'
import GameObject from '../../../commons/GameObject'
import ShaderProgram from '../../../commons/ShaderProgram'
import Shader from '../../../commons/Shader'
import simpleVertexShader from '../shaders/simpleVertexShader'
import simpleFragmentShader from '../shaders/simpleFragmentShader'


class Square extends GameObject {
  constructor() {
    super()
    // shader
    this.program = new ShaderProgram([
      new Shader(simpleVertexShader, this.gl.VERTEX_SHADER),
      new Shader(simpleFragmentShader, this.gl.FRAGMENT_SHADER)
    ])
    // mesh
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      vertexCount: 4,
      primitiveType: this.gl.TRIANGLE_STRIP,
      vertices: [
        +0.75, +0.75, 0, +1.0, 0.0, +0.0,
        -0.75, +0.75, 0, 0.0, +1.0, +1.0,
        +0.75, -0.75, 0, 0.0, +0.0, +1.0,
        -0.75, -0.75, 0, 0.0, +0.5, +0.5
      ]
    }
  }

  init() {
    // bind
    this.program.init()
    this.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.program.enableAttr('aPos', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 6, 0)
    this.program.enableAttr('aColor', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 6, Float32Array.BYTES_PER_ELEMENT * 3)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW)

    this.pMatrix = glm.mat4.create()
    glm.mat4.perspective(this.pMatrix, 0.75, aquarae.canvas.width/aquarae.canvas.height, 0.1, 100)
    this.program.setMatrixUniform('pMatrix', this.pMatrix)

    this.vMatrix = glm.mat4.create()
    this.program.setMatrixUniform('vMatrix', this.vMatrix)

    this.mMatrix = glm.mat4.create()
    glm.mat4.identity(this.mMatrix)
    glm.mat4.translate(this.mMatrix, this.mMatrix, [0, 0, -5])
    this.program.setMatrixUniform('mMatrix', this.mMatrix)

    // clear
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.program.disable()
    super.init()
  }

  update() {
    // bind
    this.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    // update
    const elapsedTime = stateManager.getTimeElapsed()
    this.program.setFloatUniform('uTime', elapsedTime)

    const delta = stateManager.getDelta()
    glm.mat4.rotate(this.mMatrix, this.mMatrix, delta, [0, 1, 0])
    this.program.setMatrixUniform('mMatrix', this.mMatrix)

    // clear
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.program.disable()
    super.update()
  }

  render() {
    // bind
    this.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.gl.drawArrays(this.mesh.primitiveType, 0, this.mesh.vertexCount)
    // clear
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.program.disable()
    super.render()
  }

  reset() {
    sceneManager.getCurScene().remove(this)
    super.reset()
  }
}

export default Square