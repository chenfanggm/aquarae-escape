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
        +0.75, +0.75, 0.0, +1.0, +0.0,
        -0.75, +0.75, 0.0, +1.0, +1.0,
        +0.75, -0.75, 0.0, +0.0, +1.0,
        -0.75, -0.75, 0.0, +0.5, +0.5
      ]
    }
  }

  init() {
    // bind
    this.program.init()
    this.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.program.enableAttr('pos', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 5, 0)
    this.program.enableAttr('color', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 2)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW)
    super.init()
  }

  update() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    const elapsedTime = stateManager.getTimeElapsed()
    const vertices = new Float32Array(this.mesh.vertices.slice(0));
    for ( let i = 1; i < vertices.length; i += 5 ) {
      vertices[i] = this.mesh.vertices[i] + (Math.sin(elapsedTime * Math.PI / 1800.0) / 4.0);
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    super.update()
  }

  render() {
    // bind
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.program.enable()
    this.gl.drawArrays(this.mesh.primitiveType, 0, this.mesh.vertexCount)
    // clear
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.program.disable()
    super.render()
  }

  clear() {
    sceneManager.getCurScene().remove(this)
    super.clear()
  }
}

export default Square