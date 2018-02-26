
class ModelManager {
  constructor() {
    this.models = {};
  }

  add(name, model) {
    if (this.models[name]) throw new Error(`Model ${name} already exist`);
    this.models[name] = model;
  }

  get(name) {
    if (this.models[name]) return this.models[name];
    throw new Error(`Not existing model with name: ${name}`);
  }

  remove(model) {
    if (typeof model === 'object') {
      delete this.models[model.name];
    }
    delete this.models[model];
  }
}

const modelManager = new ModelManager();
export default modelManager;