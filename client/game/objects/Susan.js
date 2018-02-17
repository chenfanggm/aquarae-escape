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

  init() {
    this.transform.rotate([-90, 0, 0]);
    this.preload().then(() => { super.init(); });
  }

  preload() {
    this.isReady = false;
    const promises = [
      resourceManager.loadJson('/models/susan/susan.json'),
      resourceManager.loadImage('/models/susan/susan.png')
    ];
    return Promise.all(promises)
      .then((data) => {
        // mesh
        const mesh = data[0].meshes[0];
        this.mesh.vertices = mesh.vertices;
        this.mesh.indices = [].concat.apply([], mesh.faces);
        this.mesh.normals = mesh.normals;
        this.mesh.uvs = mesh.texturecoords[0];
        // textures
        this.textures.push({
          data: data[1],
          isFlipY: true
        });
      });
  }

  update() {
    const delta = timeManager.getDeltaTime();
    const eulerAngleDiffY = delta / 1000 / 6 * 360;
    this.transform.rotate([0, 0, eulerAngleDiffY]);
    super.update();
  }

}

export default Susan;