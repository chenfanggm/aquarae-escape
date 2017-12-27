import uuid from 'uuid/v4'
import objectManager from './managers/objectManager'
import * as glm from './libs/gl-matrix'


class GameObject {
  constructor(id) {
    this.gl = aquarae.gl
    this.name = id || uuid()
    this.children = []
    this.components = []
    this.transform = glm.mat4.create()
    this.program = null
    this.mesh = null

    objectManager.add(this.name, this)
  }

  init() {
    this.components.forEach((component) => {
      component.init()
    })
    this.children.forEach((obj) => {
      obj.init()
    })
  }

  input() {
    this.components.forEach((component) => {
      component.input()
    })
    this.children.forEach((obj) => {
      obj.input()
    })
  }

  update() {
    this.components.forEach((component) => {
      component.update()
    })
    this.children.forEach((obj) => {
      obj.update()
    })
  }

  render() {
    this.components.forEach((component) => {
      component.render()
    })
    this.children.forEach((obj) => {
      obj.render()
    })
  }

  clear() {
    this.components.forEach((component) => {
      component.clear()
    })
    this.children.forEach((obj) => {
        obj.clear()
    })
  }

  reset() {
    this.components.forEach((component) => {
      component.reset()
    })
    this.children.forEach((obj) => {
        obj.reset()
    })
  }

  addChild(obj) {
    this.children.push(obj)
  }

  addComponent(component) {
    this.components.push(component)
  }

  getTransform() {
    return this.transform
  }
}

export default GameObject