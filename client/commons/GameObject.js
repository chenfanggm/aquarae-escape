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
    // mesh
    if (this.mesh && this.program) {
      this.program.init()
      this.program.enable()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW)
      this.program.enableAttr('pos', 2, 0, 0)
      // clear
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.program.disable()
    }

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
    // mesh
    if (this.mesh && this.program) {
      // bind
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
      this.program.enable()
      // draw
      this.gl.drawArrays(this.mesh.primitiveType, 0, this.mesh.vertexCount)
      // clear
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.program.disable()
    }

    this.children.forEach((obj) => {
      if (obj instanceof GameObject && typeof obj.render === 'function')
        obj.render()
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