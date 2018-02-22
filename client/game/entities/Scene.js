import uuid from 'uuid/v4';
import sceneManager from '../managers/sceneManager';


class Scene {
  constructor(id=uuid(), meta = {}) {
    this.gl = aquarae.gl;
    this.meta = meta || {};
    this.lights = [];
    this.children = [];
    sceneManager.add(id, this);
  }

  preload() {
    console.log('[Scene] Pre loading...');
    this.meta && this.meta.objects && this.meta.objects.forEach((obj) => {
      this.addChild(new obj.clazz(obj.opts));
    });
    this.meta && this.meta.guis && this.meta.guis.forEach((gui) => {
      this.addChild(new gui.clazz(gui.opts));
    });
    return Promise.all(this.children.map((obj) => {
      return obj.preload();
    }));
  }

  init() {
    this.children.forEach((obj) => {
      return obj.init();
    });
  }

  input() {
    this.children.forEach((obj) => {
      obj.input();
    });
  }

  enqueue() {
    this.children.forEach((obj) => {
      obj.enqueue();
    });
  }

  update() {
    this.children.forEach((obj) => {
      if (obj.isReady) {
        obj.update();
      }
    });
  }

  render() {
    this.children.forEach((obj) => {
      if (obj.isReady) {
        obj.render();
      }
    });
  }

  reset() {
    this.children.forEach((obj) => {
      obj.reset();
    });
    this.children = [];
  }

  addChild(obj) {
    this.children.push(obj);
  }

  addLight(light) {
    this.lights.push(light);
  }

  getLights() {
    return this.lights;
  }

  remove(obj) {
    const objIndex = this.children.indexOf(obj);
    if (objIndex > -1) {
      this.children.splice(objIndex, 1);
    }
  }
}

export default Scene;
