import shaderManager from '../../commons/managers/shaderManager'
import GameObject from '../../commons/GameObject'
import MeshRenderer from '../../commons/MeshRenderer'


class Square extends GameObject {
  constructor() {
    super()
    this.material = {
      program: shaderManager.get('simpleStandardShader')
    }

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
    this.addComponent(new MeshRenderer(this))
  }
}

export default Square