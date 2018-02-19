import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Susan extends GameObject {
  constructor(opts) {
    super(opts);
    this.addComponent(new MeshRenderer(this, shaderManager.get('simpleDiffuseShader')));
  }

  preload() {
    return Promise.all([
      resourceManager.loadJson('/models/susan/susan.json')
        .then((response) => {
          const mesh = response.meshes[0];
          this.mesh.vertices = mesh.vertices;
          this.mesh.indices = [].concat.apply([], mesh.faces);
          this.mesh.normals = mesh.normals;
          this.mesh.uvs = mesh.texturecoords[0];
        }),
      resourceManager.loadImage('/models/susan/susan.png')
        .then((response) => {
          this.textures.push({
            data: response,
            isFlipY: true
          });
        })
    ]);
  }

  init() {
    this.transform.rotate([-90, 0, 0]);
    super.init();
  }

  update() {
    const delta = timeManager.getDeltaTime();
    const eulerAngleDiffY = delta / 1000 / 6 * 360;
    this.transform.rotate([0, 0, eulerAngleDiffY]);
    super.update();
  }

}

export default Susan;