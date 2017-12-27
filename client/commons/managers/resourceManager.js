import path from 'path'


class ResourceManager {
  constructor() {
    this.baseDir = path.resolve(__dirname, '../../')
    this.gameDir = path.join(this.baseDir, 'game')
    this.shaderDir = path.join(this.gameDir, 'shaders')
  }
}

export default new ResourceManager()