import stateManager from '../../commons/managers/stateManager'
import shaderManager from '../../commons/managers/shaderManager'
import resourceManager from '../../commons/managers/resourceManager'
import GameObject from '../../commons/GameObject'
import MeshRenderer from '../../commons/MeshRenderer'


class Susan extends GameObject {
  constructor() {
    super()
    this.material = {
      program: shaderManager.get('simpleDiffuseShader')
    }
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      texCoordBuffer: this.gl.createBuffer(),
      texBuffer: this.gl.createTexture(),
      primitiveType: this.gl.TRIANGLES,
      vertices: null,
      indices: null,
      texCoords: null
    }

    this.addComponent(new MeshRenderer(this))
  }

  init() {
    this.preload().then(() => {
      this.transform.translate([2, 0, 1])
      super.init()
    })
  }

  preload() {
    this.isReady = false
    const promises = [
      resourceManager.loadJson('/models/susan/susan.json')
        .then((model) => {
          const mesh = model.meshes[0]
          this.mesh.vertices = mesh.vertices
          this.mesh.indices = [].concat.apply([], mesh.faces)
          this.mesh.texCoords = mesh.texturecoords[0]
        }),
      resourceManager.loadAndApplyTexture('/models/susan/susan.png', this)
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

export default Susan