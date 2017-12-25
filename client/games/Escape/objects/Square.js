import GameObject from '../../../commons/GameObject'
import ShaderProgram from '../../../commons/ShaderProgram'
import Shader from '../../../commons/Shader'
import sceneManager from '../../../commons/managers/sceneManager'
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
        +0.75, +0.75,
        -0.75, +0.75,
        +0.75, -0.75,
        -0.75, -0.75
      ]
    }
  }

  init() {
    super.init()
  }

  update() {
    super.update()
  }

  render() {
    super.render()
  }

  clear() {
    sceneManager.getCurScene().remove(this)
    super.clear()
  }
}

export default Square