
class ShaderManager {
  constructor() {
    this.shaders = {};
  }

  add(name, shader) {
    if (Array.isArray(name)) {
      const shaders = name;
      shaders.forEach((shader) => {
        if (this.shaders[shader.name])
          throw new Error(`shader with name [${shader.name}] has already registered`);
        this.shaders[shader.name] = shader;
      });
    } else {
      if (this.shaders[name])
        throw new Error(`shader with name [${name}] has already registered`);
      this.shaders[name] = shader;
    }
  }

  get(name) {
    if (!this.shaders[name])
      throw new Error(`shader with name [${name}] does not exist`);
    return this.shaders[name];
  }

  clear() {}

  reset() {
    this.shaders = {};
  }
}

const shaderManager = new ShaderManager();
export default shaderManager;