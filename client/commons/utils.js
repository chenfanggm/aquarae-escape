import * as glm from './libs/gl-matrix'


const identityMatrix = glm.mat4.create()

export default {
  hexToRGB: (hex) => {
    const r = hex >> 16
    const g = hex >> 8 & 0xFF
    const b = hex & 0xFF
    return [r, g, b]
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