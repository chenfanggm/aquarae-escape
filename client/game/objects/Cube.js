import shaderManager from '../managers/shaderManager';
import modelManager from '../managers/modelManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../components/MeshRenderer';


class Cube extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'cube';
    this.modelName = 'cube';
    this.program = shaderManager.get('simpleDiffuseSpecularShader');
    this.addComponent(new MeshRenderer(this, this.program));
  }
}

export default Cube;