import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../components/MeshRenderer';


class Susan extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'susan';
    this.modelName = 'susan';
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
    this.transform.rotate([0, 0, eulerAngleDiffY]);
    super.update();
  }

}

export default Susan;