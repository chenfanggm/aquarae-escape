
class ShaderManager {
  constructor() {
    this.shaders = {};
  }

  register(id, shader) {
    if (Array.isArray(id)) {
      const shaders = id;
      shaders.forEach((shader) => {
        if (this.shaders[shader.id])
          throw new Error(`shader with id [${shader.id}] has already registered`);
        this.shaders[shader.id] = shader;
      });
    } else {
      if (this.shaders[id])
        throw new Error(`shader with id [${id}] has already registered`);
      this.shaders[id] = shader;
    }
  }

  get(id) {
    if (!this.shaders[id])
      throw new Error(`shader with id [${id}] does not exist`);
    return this.shaders[id];
  }

  clear() {}

  reset() {
    this.shaders = {};
  }
}

const shaderManager = new ShaderManager();
export default shaderManager;