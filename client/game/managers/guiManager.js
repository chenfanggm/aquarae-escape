
class GuiManager {
  constructor() {
    this.guis = {}
  }

  add(object) {
    if (this.guis[object.name]) throw new Error(`object ${object.name} already exist`);
    this.guis[object.name] = object
  }

  remove(name) {
    if (typeof name === 'object') {
      delete this.guis[name.name]
    }
    delete this.guis[name]
  }

  get(name) {
    if (this.guis[name]) return this.guis[name];
    throw new Error(`not existing object with name: ${name}`)
  }

  getAll() {
    return Object.values(this.guis)
  }

  reset() {
    Object.values(this.guis).forEach((obj) => {
      obj.reset()
    });
    this.guis = {}
  }
}

const guiManager = new GuiManager();
export default guiManager