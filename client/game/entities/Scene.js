import uuid from 'uuid/v4'
import sceneManager from '../managers/sceneManager'
import GameObject from './GameObject'


class Scene {
  constructor(id) {
    this.id = id || uuid()
    this.gl = aquarae.gl
    this.children = []
    sceneManager.add(id, this)
  }

  init() {
    this.children.forEach((obj) => {
      obj.init()
    })
  }

  input() {
    this.children.forEach((obj) => {
      obj.input()
    })
  }

  enqueue() {
    this.children.forEach((obj) => {
      obj.enqueue()
    })
  }

  update() {
    this.children.forEach((obj) => {
      if (obj.isReady) {
        obj.update()
      }
    })
  }

  render() {
    this.children.forEach((obj) => {
      if (obj.isReady) {
        obj.render()
      }
    })
  }

  reset() {
    this.children.forEach((obj) => {
      obj.reset()
    })
    this.children = []
  }

  addChild(obj) {
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