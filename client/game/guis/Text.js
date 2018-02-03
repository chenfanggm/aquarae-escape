import shaderManager from '../managers/shaderManager';
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
}

export default Text;