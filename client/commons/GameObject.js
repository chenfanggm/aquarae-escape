import * as THREE from 'three'
import uuid from 'uuid/v4'
import objectManager from './managers/objectManager'


class GameObject extends THREE.Object3D {
  constructor(id) {
    super()
    this.gl = aquarae.gl
    this.name = id || uuid()
    objectManager.add(this.name, this)
    this.program = null
    this.mesh = null
  }

  init() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.init === 'function')
        obj.init()
    })
  }

  update() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.update === 'function')
        obj.update()
    })
  }

  render() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.render === 'function')
        obj.render()
    })
  }

  postRender() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.postRender === 'function')
        obj.postRender()
    })
  }

  clear() {
    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.clear === 'function')
        obj.clear()
    })
  }
}

export default GameObject