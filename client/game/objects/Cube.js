import stateManager from '../../commons/managers/stateManager'
import shaderManager from '../../commons/managers/shaderManager'
import resourceManager from '../../commons/managers/resourceManager'
import GameObject from '../../commons/GameObject'
import MeshRenderer from '../../commons/MeshRenderer'


class Cube extends GameObject {
  constructor() {
    super()
    this.material = {
      program: shaderManager.get('simpleDiffuseShader')
    }
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      uvBuffer: this.gl.createBuffer(),
      texBuffer: this.gl.createTexture(),
      primitiveType: this.gl.TRIANGLES,
      vertices: [
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
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
      ],
      uvs: [
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
      ]
    }

    this.addComponent(new MeshRenderer(this))
  }

  init() {
    this.preload().then(() => {super.init()})
  }

  preload() {
    this.isReady = false
    const promises = [
      resourceManager.loadAndApplyTexture('/textures/cube/wood_crate.png', this)
    ]
    return Promise.all(promises)
  }

  update() {
    const delta = stateManager.getDelta()
    const eulerAngleDiffY = delta / 1000 / 6 * 360
    this.transform.rotate([0, eulerAngleDiffY, 0])
    super.update()
  }

}

export default Cube