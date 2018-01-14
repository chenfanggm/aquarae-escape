import * as glm from '../libs/gl-matrix'
import timeManager from '../managers/timeManager'
import serverConfig from '../../../server/config'


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
  },

  getAnimationCompletion(animationStartTime) {
    const timeNow = timeManager.getTimeElapsed()
    let targetAnimationCompletion = (timeNow - animationStartTime) / serverConfig.SERVER_BROADCAST_INTERVAL
    if (targetAnimationCompletion < 0) targetAnimationCompletion = 0
    else if (targetAnimationCompletion > 1.2) targetAnimationCompletion = 1
    return targetAnimationCompletion
  }
}