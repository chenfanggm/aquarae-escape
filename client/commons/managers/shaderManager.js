
class ShaderManager {
  constructor() {
    this.shaders = {}
  }

  register(id, shader) {
    if (typeof id === 'object') {
      const shaders = id
      for (const id in shaders) {
        if (this.shaders[id])
          throw new Error(`shader with id [${id}] has already registered`)
        this.shaders[id] = shaders[id]
      }
    } else {
      if (this.shaders[id])
        throw new Error(`shader with id [${id}] has already registered`)
      this.shaders[id] = shader
    }
  }

  get(id) {
    if (!this.shaders[id])
      throw new Error(`shader with id [${id}] does not exist`)
    return this.shaders[id]
  }

  clear() {}

  reset() {
    this.shaders = {}
  }
}

const shaderManager = new ShaderManager()
export default shaderManager