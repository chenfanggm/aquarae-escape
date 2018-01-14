import path from 'path'
import axios from 'axios'

class ResourceManager {
  constructor() {
    this.baseDir = path.resolve(__dirname, '../../')
    this.gameDir = path.join(this.baseDir, 'game')
    this.shaderDir = path.join(this.gameDir, 'shaders')
    this.resources = {}

    this.loadAndApplyTexture = this.loadAndApplyTexture.bind(this)
  }

  loadText(path) {
    if (this.resources[path]) {
      return Promise.resolve(this.resources[path])
    }
    return axios({
      method:'GET',
      url: path,
      responseType: 'text'
    })
      .then((response) => {
        this.resources[path] = response.data
        return response.data
      })
      .catch((err) => {
        console.error(err)
      })
  }

  loadJson(path) {
    if (this.resources[path]) {
      return Promise.resolve(this.resources[path])
    }
    return axios({
      method:'GET',
      url: path
    })
      .then((response) => {
        this.resources[path] = response.data
        return response.data
      })
      .catch((err) => {
        console.error(err)
      })
  }

  loadImage(path) {
    if (this.resources[path]) {
      return Promise.resolve(this.resources[path])
    }
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        this.resources[path] = image
        resolve(image)
      }
      image.src = path
    })
      .catch((err) => {
        console.error(err)
      })
  }

  loadAndApplyTexture(path, obj, isFlipY = false) {
    if (this.resources[path]) {
      return Promise.resolve(this.resources[path])
        .then((image) => {
          this.bindTexture(obj, image, isFlipY)
        })
    }

    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        this.resources[path] = image
        resolve(image)
      }
      image.src = path
    })
      .then((image) => {
        this.bindTexture(obj, image, isFlipY)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  bindTexture(obj, image, isFlipY) {
    obj.gl.bindTexture(obj.gl.TEXTURE_2D, obj.mesh.texBuffer)
    obj.gl.pixelStorei(obj.gl.UNPACK_FLIP_Y_WEBGL, isFlipY)
    obj.gl.texImage2D(obj.gl.TEXTURE_2D, 0, obj.gl.RGBA, obj.gl.RGBA, obj.gl.UNSIGNED_BYTE, image)
    obj.gl.texParameteri(obj.gl.TEXTURE_2D, obj.gl.TEXTURE_MAG_FILTER, obj.gl.LINEAR)
    obj.gl.texParameteri(obj.gl.TEXTURE_2D, obj.gl.TEXTURE_MIN_FILTER, obj.gl.LINEAR)
    obj.gl.texParameteri(obj.gl.TEXTURE_2D, obj.gl.TEXTURE_WRAP_T, obj.gl.CLAMP_TO_EDGE)
    obj.gl.texParameteri(obj.gl.TEXTURE_2D, obj.gl.TEXTURE_WRAP_S, obj.gl.CLAMP_TO_EDGE)
    obj.gl.bindTexture(obj.gl.TEXTURE_2D, null)
  }
}

export default new ResourceManager()