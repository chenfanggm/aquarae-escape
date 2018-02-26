import shaderManager from '../managers/shaderManager';
import modelManager from '../managers/modelManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Cube extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'cube';
    this.modelName = 'cube';
    this.renderer = new MeshRenderer(this, shaderManager.get('simpleDiffuseSpecularShader'));
  }
}

export default Cube;