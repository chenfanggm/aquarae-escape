import sceneManager from './sceneManager';


class RendererManager {
  constructor() {
    this.renderingObjects = {};
  }

  init() {
    this.gl = aquarae.gl;
  }

  render() {
    this.prepare();

    Object.keys(this.renderingObjects).forEach((key) => {
      const renderObjects = this.renderingObjects[key];
      const sampleObject = renderObjects[0];
      const model = sampleObject.model;
      const program = sampleObject.renderer.program;
      this.bindBuffer(model, program);
      this.renderObject(renderObjects);
      this.clear(program);
    });
  }

  prepare() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.frontFace(this.gl.CCW);
    this.enableCulling();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const curScene = sceneManager.getCurScene();
    this.gl.clearColor(curScene.clearColor[0], curScene.clearColor[1], curScene.clearColor[2], 1.0);
  }

  bindBuffer(model, program) {
    if (model.isHasTransparency) {
      this.disableCulling();
    }
    program.enable();
    model.getTextureBuffers().forEach((textureBuffer, index) => {
      this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
    });
    this.gl.bindVertexArray(model.getVAO());
  }

  renderObject(objects) {
    objects.forEach((obj) => {
      obj.renderer.render();
    });
  }

  clear(program) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindVertexArray(null);
    this.enableCulling();
    program.disable();
  }

  enableCulling() {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  disableCulling() {
    this.gl.disable(this.gl.CULL_FACE);
  }

  add(object) {
    const rendererHash = this.getHash(object);
    const renderer = this.renderingObjects[rendererHash];
    if (renderer) {
      renderer.push(object);
    } else {
      this.renderingObjects[rendererHash] = [object];
    }
  }

  get(object) {
    const rendererHash = this.getHash(object);
    const renderer = this.renderingObjects[rendererHash];
    if (renderer) return renderer;
    throw new Error(`Not found renderer on: ${object.name}`);
  }

  getHash(object) {
    return `${object.model.name}${object.renderer.program.name}`;
  }

  reset() {
    this.renderingObjects = {};
  }
}

const rendererManager = new RendererManager();
export default rendererManager;