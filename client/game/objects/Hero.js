import shaderManager from '../managers/shaderManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Hero extends GameObject {
  constructor(opts) {
    super(opts);
    this.name = 'hero';
    this.modelName = 'cube';
    this.renderer = new MeshRenderer(this, shaderManager.get('simpleDiffuseSpecularShader'));
  }
}

export default Hero;