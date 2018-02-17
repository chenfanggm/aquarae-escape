import uuid from 'uuid/v4';
import objectManager from '../managers/objectManager';
import Transform from './Transform';


class GameObject {
  constructor(opts = {}) {
    this.gl = aquarae.gl;
    this.id = opts.id || uuid();
    this.name = opts.name || this.id;
    this.children = [];
    this.components = [];
    this.transform = new Transform(this, opts.transform);
    this.mesh = {};
    this.material = null;
    this.textures = [];
    this.addComponent(this.transform);
    objectManager.add(this);
    this.isReady = false;
  }

  preload() {
    return Promise.resolve();
  }

  init() {
    this.components.forEach((component) => {
      component.init();
    });
    this.children.forEach((obj) => {
      obj.init();
    });
    this.isReady = true;
  }

  input() {
    this.components.forEach((component) => {
      component.input();
    });
    this.children.forEach((obj) => {
      obj.input();
    });
  }

  enqueue() {
    this.components.forEach((component) => {
      component.enqueue();
    });
    this.children.forEach((obj) => {
      obj.enqueue();
    });
  }

  update() {
    this.components.forEach((component) => {
      component.update();
    });
    this.children.forEach((obj) => {
      obj.update();
    });
  }

  render() {
    this.components.forEach((component) => {
      component.render();
    });
    this.children.forEach((obj) => {
      obj.render();
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
}

export default GameObject;