import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../components/MeshRenderer';
import modelManager from "../managers/modelManager";


class Plane extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'plane';
    this.modelName = 'plane';
    this.program = shaderManager.get('simpleDiffuseSpecularShader');
    this.addComponent(new MeshRenderer(this, this.program));
  }
}

export default Plane;