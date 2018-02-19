import GameObject from '../entities/GameObject';
import sceneManager from '../managers/sceneManager';


class Template extends GameObject {
  preload() {
    return super.preload()
  }

  init() {
    super.init();
  }

  update() {
    super.update();
  }

  render() {
    super.render();
  }

  reset() {
    sceneManager.getCurScene().remove(this.mesh);
    super.reset();
  }
}

export default Template;