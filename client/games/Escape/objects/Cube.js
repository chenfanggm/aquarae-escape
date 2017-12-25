import * as glm from '../../../commons/libs/gl-matrix'
import stateManager from '../../../commons/managers/stateManager'
import sceneManager from '../../../commons/managers/sceneManager'
import GameObject from '../../../commons/GameObject'
import ShaderProgram from '../../../commons/ShaderProgram'
import Shader from '../../../commons/Shader'
import simpleVertexShader from '../shaders/simpleVertexShader'
import simpleFragmentShader from '../shaders/simpleFragmentShader'


class Cube extends GameObject {
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
      vertexCount: 10,
      primitiveType: this.gl.TRIANGLE_STRIP,
      vertices: [
        -0.75, +0.75, +0.75,    +0.0, +1.0, +0.0, /* front-top-left */
        -0.75, -0.75, +0.75,    +1.0, +0.0, +1.0, /* front-bottom-left */
        +0.75, +0.75, +0.75,    +0.75,+0.25,+0.5, /* front-top-right */
        +0.75, -0.75, +0.75,    +0.5, +0.25,+0.0, /* front-bottom-right */
        +0.75, +0.75, -0.75,    +0.25,+0.75,+1.0, /* rear-top-right */
        +0.75, -0.75, -0.75,    +1.0, +1.0, +0.0, /* rear-bottom-right */
        -0.75, +0.75, -0.75,    +0.0, +0.0, +1.0, /* rear-top-left */
        -0.75, -0.75, -0.75,    +0.0, +1.0, +0.0, /* rear-bottom-left */
        -0.75, +0.75, +0.75,    +0.0, +1.0, +0.0, /* front-top-left */
        -0.75, -0.75, +0.75,    +1.0, +0.0, +1.0  /* front-bottom-left */
      ]
    }
  }

  init() {
    // bind
    this.program.init()
    this.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.program.enableAttr('pos', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 6, 0)
    this.program.enableAttr('color', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 6, Float32Array.BYTES_PER_ELEMENT * 3)
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

    const delta = parseFloat(stateManager.getDelta() / 250)
    glm.mat4.rotate(this.mMatrix, this.mMatrix, delta, [0, 1, 0])
    this.program.setMatrixUniform('mMatrix', this.mMatrix)
    console.log(delta)
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

export default Cube