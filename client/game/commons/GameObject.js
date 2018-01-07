import uuid from 'uuid/v4'
import objectManager from './managers/objectManager'
import Transform from './Transform'
import shaderManager from "./managers/shaderManager";


class GameObject {
  constructor(opts = {}) {
    this.gl = aquarae.gl
    this.id = opts.id || uuid()
    this.children = []
    this.components = []
    this.transform = new Transform(this)
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      uvBuffer: this.gl.createBuffer(),
      texBuffer: this.gl.createTexture(),
      normalBuffer: this.gl.createBuffer(),
      primitiveType: this.gl.TRIANGLES,
      vertices: null,
      indices: null,
      uvs: null,
      normals: null,
    }
    this.material = null
    this.isReady = true

    if (opts.position) {
      this.transform.setPosition(opts.position)
    }

    this.addComponent(this.transform)
    objectManager.add(this.id, this)
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

  enqueue() {
    this.components.forEach((component) => {
      component.enqueue()
    })
    this.children.forEach((obj) => {
      obj.enqueue()
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