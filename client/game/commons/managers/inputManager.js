import KeyCode from 'keycode-js'
import gameService from '../../services/gameService'

class InputManager {
  constructor() {
    this.keyMap = {}
    this.axis = {
      Horizontal: 0,
      Vertical: 0
    }
    this.setKeyDown = this.setKeyDown.bind(this)
    this.setKeyUp = this.setKeyUp.bind(this)
  }

  init() {
    window.addEventListener('keyup', (event) => {
      this.setKeyUp(event.keyCode)
    })

    window.addEventListener('keydown', (event) => {
      this.setKeyDown(event.keyCode)
    })
  }

  onChange() {
    this.updateAxis()
  }

  sendKeyMap() {
    gameService.sendKeyMap(this.keyMap)
  }

  setKeyDown(keyCode) {
    this.keyMap[keyCode] = true
    this.onChange()
  }

  setKeyUp(keyCode) {
    this.keyMap[keyCode] = false
    this.onChange()
  }

  getKey(keyCode) {
    return this.keyMap[keyCode] || false
  }

  getAxis(axisName) {
    return this.axis[axisName]
  }

  updateAxis() {
    if (this.keyMap[KeyCode.KEY_A] || this.keyMap[KeyCode.KEY_LEFT]) {
      this.axis.Horizontal = -1
    } else if (this.keyMap[KeyCode.KEY_D] || this.keyMap[KeyCode.KEY_RIGHT]) {
      this.axis.Horizontal = 1
    } else {
      this.axis.Horizontal = 0
    }

    if (this.keyMap[KeyCode.KEY_W] || this.keyMap[KeyCode.KEY_UP]) {
      this.axis.Vertical = 1
    } else if (this.keyMap[KeyCode.KEY_S] || this.keyMap[KeyCode.KEY_DOWN]) {
      this.axis.Vertical = -1
    } else {
      this.axis.Vertical = 0
    }
  }
}

export default new InputManager()