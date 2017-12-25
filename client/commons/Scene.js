import helper from '../utils/helper'
import GameObject from './GameObject'
import sceneManager from './managers/sceneManager'
import objectManager from './managers/objectManager'


class Scene {
  constructor(id) {
    this.name = id || ''
    this.gl = aquarae.gl
    this.children = []
    sceneManager.add(id || this.id, this)
  }

  init() {
    objectManager.getAll().forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.init === 'function') {
        obj.init()
      }
    })
    if (__DEBUG__) {
      this.renderHelper()
    }
  }

  update() {
    objectManager.getAll().forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.update === 'function') {
        obj.update()
      }
    })
  }

  render() {
    objectManager.getAll().forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.render === 'function') {
        obj.render(this)
      }
    })
  }

  clear() {
    this.children.forEach((obj) => {
      obj.clear()
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

  renderHelper() {
    helper.renderOriginIndicator(this)
  }
}

export default Scene
