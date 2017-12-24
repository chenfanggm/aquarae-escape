import * as THREE from 'three'
import Game from '../../commons/Game'
import MainScene from './scenes/MainScene'
import sceneManager from '../../commons/managers/sceneManager'
import objectManager from '../../commons/managers/objectManager'


class Escape extends Game {
  init(opts) {
    // meta
    this.width = this.canvas.width / 1.2
    this.height = this.canvas.height / 1.2
    this.bgColor = 0xDDDDDD
    // camera
    this.cameraFov = 45
    this.cameraNear = 0.1
    this.cameraFar = 1000
    this.cameraAspect = this.width / this.height
    this.mainCamera = new THREE.PerspectiveCamera(this.cameraFov, this.cameraAspect, this.cameraNear, this.cameraFar)
    objectManager.add('mainCamera', this.mainCamera)

    sceneManager.setCurScene(new MainScene('mainScene'))
    super.init(opts)
  }
}

export default Escape