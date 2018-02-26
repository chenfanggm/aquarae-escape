import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Tree extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'tree';
    this.modelName = 'tree';
    this.renderer = new MeshRenderer(this, shaderManager.get('simpleDiffuseSpecularShader'));
  }

  init() {
    this.transform.rotate([-90, 0, 0]);
    super.init();
  }

  update() {
    const delta = timeManager.getDeltaTime();
    const eulerAngleDiffY = delta / 1000 / 6 * 360;
    this.transform.rotate([0, eulerAngleDiffY, 0]);
    super.update();
  }

}

export default Tree;