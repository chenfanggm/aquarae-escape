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
      uvBuffer: this.gl.createBuffer(),
      texBuffer: this.gl.createTexture(),
      normalBuffer: this.gl.createBuffer(),
      primitiveType: this.gl.TRIANGLES,
      vertices: null,
      indices: null,
      uvs: null,
      normals: null,
    }

    this.addComponent(new MeshRenderer(this))
  }

  init() {
    this.transform.rotate([-90, 0, 0])
    this.preload().then(() => {super.init()})
  }

  preload() {
    this.isReady = false
    const promises = [
      resourceManager.loadJson('/models/susan/susan.json')
        .then((model) => {
          const mesh = model.meshes[0]
          this.mesh.vertices = mesh.vertices
          this.mesh.indices = [].concat.apply([], mesh.faces)
          this.mesh.uvs = mesh.texturecoords[0]
          this.mesh.normals = mesh.normals
        }),
      resourceManager.loadAndApplyTexture('/models/susan/susan.png', this, true)
    ]
    return Promise.all(promises)
  }

  update() {
    const delta = stateManager.getDelta()
    const eulerAngleDiffY = delta / 1000 / 6 * 360
    this.transform.rotate([0, 0, eulerAngleDiffY])
    super.update()
  }

}

export default Susan