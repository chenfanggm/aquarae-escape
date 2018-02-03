import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GuiObject from '../entities/GuiObject';
import GuiRenderer from '../entities/GuiRenderer';


class Text extends GuiObject {
  constructor(opts) {
    super(opts);
    this.material = {
      program: shaderManager.get('bitmapFontShader')
    };
    this.message = opts.message;
    this.position = opts.position;
    this.addComponent(new GuiRenderer(this));
  }

  init() {
    this.preload().then(() => { super.init(); });
  }

  preload() {
    this.isReady = false;
    const promises = [
      resourceManager.loadAndApplyTexture('/textures/cube/wood_crate.png', this)
    ];
    return Promise.all(promises);
  }

}

export default Text;