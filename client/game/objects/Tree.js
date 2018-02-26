import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../components/MeshRenderer';


class Tree extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'tree';
    this.modelName = 'tree';
    this.program = shaderManager.get('simpleDiffuseSpecularShader');
    this.addComponent(new MeshRenderer(this, this.program));
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