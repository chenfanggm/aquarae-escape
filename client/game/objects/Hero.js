import shaderManager from '../managers/shaderManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../components/MeshRenderer';


class Hero extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'hero';
    this.modelName = 'cube';
    this.program = shaderManager.get('simpleDiffuseSpecularShader');
    this.addComponent(new MeshRenderer(this, this.program));
  }
}

export default Hero;