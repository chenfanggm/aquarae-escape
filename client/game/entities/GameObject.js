import uuid from 'uuid/v4';
import objectManager from '../managers/objectManager';
import modelManager from '../managers/modelManager';
import Transform from './Transform';
import rendererManager from "../managers/rendererManager";


class GameObject {
  constructor(opts = {}) {
    this.gl = aquarae.gl;
    this.isReady = false;
    this.id = opts.id || uuid();
    this.name = this.name || opts.name || this.id;
    this.children = [];
    this.components = [];
    this.transform = new Transform(this, opts.transform);
    this.modelName = null;
    this.model = null;
    objectManager.add(this);
  }

  preload() {
    if (this.modelName) {
      this.model = modelManager.get(this.modelName);
      return this.model.preload();
    }
    return Promise.resolve();
  }

  init() {
    // children
    this.children.forEach((obj) => {
      obj.init();
    });

    // models
    if (this.model) {
      this.model.init({
        program: this.renderer.program
      });
      rendererManager.add(this);
    }

    // components
    this.components.forEach((component) => {
      component.init();
    });
    this.isReady = true;
  }

  input() {
    this.children.forEach((obj) => {
      obj.input();
    });
    this.components.forEach((component) => {
      component.input();
    });
  }

  enqueue() {
    this.children.forEach((obj) => {
      obj.enqueue();
    });
    this.components.forEach((component) => {
      component.enqueue();
    });
  }

  update(deltaTime) {
    this.children.forEach((obj) => {
      obj.update(deltaTime);
    });
    this.components.forEach((component) => {
      component.update(deltaTime);
    });
  }

  reset() {
    this.components.forEach((component) => {
      component.reset();
    });
    this.children.forEach((obj) => {
      obj.reset();
    });
  }

  addChild(obj) {
    this.children.push(obj);
  }

  addComponent(component) {
    this.components.push(component);
  }

  spawn() {
    return this.preload()
      .then(() => {
        this.init();
      });
  }

  setPosition(pos) {
    this.transform.setPosition(pos);
  }
}

export default GameObject;
