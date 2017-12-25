import sceneManager from './managers/sceneManager'
import GameObject from './GameObject'


class Scene {
  constructor(id) {
    this.name = id || ''
    this.gl = aquarae.gl
    this.children = []
    sceneManager.add(id || this.id, this)
  }

  init() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.init === 'function') {
        obj.init()
      }
    })
  }

  update() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.update === 'function') {
        obj.update()
      }
    })
  }

  render() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.render === 'function') {
        obj.render()
      }
    })
  }

  clear() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.clear === 'function') {
        obj.clear()
      }
    })
  }

  reset() {
    this.children.forEach((obj) => {
      console.log(obj)
      obj.reset()
    })
    this.children = []
  }

  add(obj) {
    this.children.push(obj)
  }

  remove(obj) {
    const objIndex = this.children.indexOf(obj)
    if (objIndex > -1) {
      this.children.splice(objIndex, 1)
    }
  }
}

export default Scene
