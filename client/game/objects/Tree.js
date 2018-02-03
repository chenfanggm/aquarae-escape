import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Tree extends GameObject {
  constructor(opts) {
    super(opts);

    this.material = {
      program: shaderManager.get('simpleDiffuseShader')
    };

    this.addComponent(new MeshRenderer(this));
  }

  init() {
    this.transform.rotate([-90, 0, 0]);
    this.preload().then(() => { super.init(); });
  }

  preload() {
    this.isReady = false;
    const promises = [
      resourceManager.loadJson('/models/tree/tree.json')
        .then((model) => {
          const mesh = model.meshes[0];
          this.mesh.vertices = mesh.vertices;
          this.mesh.indices = [].concat.apply([], mesh.faces);
          this.mesh.normals = mesh.normals;
          this.mesh.uvs = mesh.texturecoords[0];
        })
    ];
    return Promise.all(promises);
  }

  update() {
    const delta = timeManager.getDeltaTime();
    const eulerAngleDiffY = delta / 1000 / 6 * 360;
    this.transform.rotate([0, eulerAngleDiffY, 0]);
    super.update();
  }

}

export default Tree;