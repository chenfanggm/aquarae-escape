
class RendererManager {
  constructor() {
    this.objs = {};
  }

  add(object) {
    if (this.objs[object.name]) throw new Error(`object ${object.name} already exist`);
    this.objs[object.name] = object;
  }

  get(name) {
    if (this.objs[name]) return this.objs[name];
    throw new Error(`not existing object with name: ${name}`);
  }

  remove(name) {
    if (typeof name === 'object') {
      delete this.objs[name.name];
    }
    delete this.objs[name];
  }

  getAll() {
    return Object.values(this.objs);
  }

  reset() {
    Object.values(this.objs).forEach((obj) => {
      obj.reset();
    });
    this.objs = {};
  }
}

const rendererManager = new RendererManager();
export default rendererManager;