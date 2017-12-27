import stateManager from '../../../commons/managers/stateManager'
import shaderManager from '../../../commons/managers/shaderManager'
import GameObject from '../../../commons/GameObject'
import ShaderProgram from '../../../commons/ShaderProgram'
import MeshRenderer from '../../../commons/MeshRenderer'
import utils from '../../../commons/utils'


class Cube extends GameObject {
  constructor() {
    super()
    this.material = {
      program: new ShaderProgram([
        shaderManager.get('simpleVertexShader'),
        shaderManager.get('simpleFragmentShader')
      ]),
      texBuffer: this.gl.createTexture()
    }
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      vertexCount: 24,
      primitiveType: this.gl.TRIANGLES,
      vertices: [
        // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,
        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,
        // Right
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,
        // Front
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,    1, 0,
        -1.0, -1.0, 1.0,    0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,    0, 1,
        -1.0, -1.0, -1.0,    1, 1,
        -1.0, 1.0, -1.0,    1, 0,
        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
      ],
      indices: [
        // Top
        0, 1, 2,
        0, 2, 3,
        // Left
        5, 4, 6,
        6, 4, 7,
        // Right
        8, 9, 10,
        8, 10, 11,
        // Front
        13, 12, 14,
        15, 14, 12,
        // Back
        16, 17, 18,
        16, 18, 19,
        // Bottom
        21, 20, 22,
        22, 20, 23
      ]
    }

    this.loadResource()
    this.addComponent(new MeshRenderer(this))
  }

  update() {
    const delta = stateManager.getDelta()
    const eulerAngleDiffY = delta / 1000 / 6 * 360
    this.transform.rotate([0, eulerAngleDiffY, 0])
    super.update()
  }

  loadResource() {
    this.isReady = false
    utils.loadTexture('/textures/wood_crate.png', this.material, () => {
      this.isReady = true
    })
  }
}

export default Cube