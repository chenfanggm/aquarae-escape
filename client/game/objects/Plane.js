import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';
import modelManager from "../managers/modelManager";


class Plane extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'plane';
    this.modelName = 'plane';
    this.renderer = new MeshRenderer(this, shaderManager.get('simpleDiffuseSpecularShader'));
  }
}

export default Plane;