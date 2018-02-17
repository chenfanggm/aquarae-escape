import shaderManager from '../managers/shaderManager';
import GuiObject from '../entities/GuiObject';
import GuiRenderer from '../entities/GuiRenderer';


class Text extends GuiObject {
  constructor(opts) {
    super(opts);
    this.message = opts.message;
    this.position = opts.position;
    this.addComponent(new GuiRenderer(this, shaderManager.get('bitmapFontShader')));
  }
}

export default Text;