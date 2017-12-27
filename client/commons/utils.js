import * as glm from './libs/gl-matrix'


const identityMatrix = glm.mat4.create()

export default {
  hexToRGB: (hex) => {
    const r = hex >> 16
    const g = hex >> 8 & 0xFF
    const b = hex & 0xFF
    return [r, g, b]
  },

  loadTexture(path, material, callback) {
    const gl = aquarae.gl
    const image = new Image()
    image.src = path
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, material.texBuffer)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.bindTexture(gl.TEXTURE_2D, null)
      callback && callback()
    }
  },

  getIdentityMatrix() {
    return identityMatrix
  },

  debounce(func, wait) {
    let timeout
    return function(...args) {
      const context = this
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(context, args), wait)
    }
  }
}