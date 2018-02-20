
class ModelManager {
  constructor() {
    this.prefab = {};
  }

  add(name, vao) {
    if (this.prefab[name]) throw new Error(`object ${name} already exist`);
    this.prefab[name] = vao;
  }

  remove(name) {
    delete this.prefab[name];
  }

  get(name) {
    if (this.prefab[name]) return this.prefab[name];
    return null;
  }

  getAll() {
    return Object.values(this.prefab);
  }

  reset() {
    this.prefab = {};
  }
}

const modelManager = new ModelManager();
export default modelManager;