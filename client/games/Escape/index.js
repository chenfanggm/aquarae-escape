import * as THREE from 'three'
import Game from '../../commons/Game'
import MainScene from './scenes/MainScene'
import sceneManager from '../../commons/managers/sceneManager'
import objectManager from '../../commons/managers/objectManager'


class Escape extends Game {
  init(opts) {
    // camera
    this.cameraFov = 45
    this.cameraNear = 0.1
    this.cameraFar = 1000
    this.cameraAspect = this.width / this.height
    this.mainCamera = new THREE.PerspectiveCamera(this.cameraFov, this.cameraAspect, this.cameraNear, this.cameraFar)
    objectManager.add('mainCamera', this.mainCamera)
    // renderer
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(this.bgColor, 1)
    objectManager.add('renderer', this.renderer)

    sceneManager.setCurScene(new MainScene('mainScene'))
    super.init(opts)
  }
}

export default Escape