import uuid from 'uuid/v4';
import sceneManager from '../managers/sceneManager';


class Scene {
  constructor(name) {
    if (!name) throw new Error('Name is required for creating scene.');
    this.name = name;
    this.gl = aquarae.gl;
    this.meta = {};
    this.children = [];
    this.lights = [];
    this.cameras = {};
    sceneManager.add(name, this);
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

  setMeta(meta) {
    this.meta = meta;
  }

  addChild(obj) {
    this.children.push(obj);
  }

  addLight(light) {
    this.lights.push(light);
    this.addChild(light);
  }

  getLights() {
    return this.lights;
  }

  addCamera(camera) {
    if (this.cameras[camera.name]) throw new Error(`Camera with name [${camera.name}] already exist in scene [${this.name}]`);
    this.cameras[camera.name] = camera;
    this.addChild(camera);
  }

  getCamera(name) {
    if (!this.cameras[name]) throw new Error(`Camera with name [${name}] not exist in scene [${this.name}]`);
    return this.cameras[name];
  }

  remove(obj) {
    const objIndex = this.children.indexOf(obj);
    if (objIndex > -1) {
      this.children.splice(objIndex, 1);
    }
  }
}

export default Scene;
