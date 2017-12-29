import uuid from 'uuid/v4'
import objectManager from './managers/objectManager'
import Transform from './Transform'


class GameObject {
  constructor(id) {
    this.gl = aquarae.gl
    this.name = id || uuid()
    this.children = []
    this.components = []
    this.transform = new Transform(this)
    this.mesh = null
    this.material = null
    this.isReady = true

    this.addComponent(this.transform)
    objectManager.add(this.name, this)
  }

  init() {
    this.components.forEach((component) => {
      component.init()
    })
    this.children.forEach((obj) => {
      obj.init()
    })
    this.isReady = true
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
}

export default GameObject