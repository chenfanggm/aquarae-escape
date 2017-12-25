import dat from 'dat-gui'
import '../../../commons/libs/OrbitAndPanControls.new'
import Scene from '../../../commons/Scene'
import Maze from '../objects/Maze/Maze'
import AmbientLight from '../objects/AmbientLight'
import DirectionalLight from '../objects/DirectionalLight'
import objectManager from '../../../commons/managers/objectManager'
import stateManager from '../../../commons/managers/stateManager'
import Square from '../objects/Square'


class MainScene extends Scene {
  init() {
    // // camera
    // camera
    // this.cameraFov = 45
    // this.cameraNear = 0.1
    // this.cameraFar = 1000
    // this.cameraAspect = this.width / this.height
    // this.mainCamera = new THREE.PerspectiveCamera(this.cameraFov, this.cameraAspect, this.cameraNear, this.cameraFar)
    // objectManager.add('mainCamera', this.mainCamera)
    // mainCamera.position.set(0, 50, 40)
    // mainCamera.lookAt(0, 0, 0)
    // this.cameraControls = new THREE.OrbitAndPanControls(mainCamera, aquarae.canvas.domElement)
    // this.cameraControls.target.set(0, 0, 5)
    // // resources
    // const mazeWidth = 50
    // const mazeHeight = 50
    // this.add(new Maze('maze', { width: mazeWidth, height: mazeHeight }))
    // this.add(new AmbientLight('ambientLight', { position: new THREE.Vector3(100, 100, 100) }))
    // this.add(new DirectionalLight('directionalLight', {
    //   position: new THREE.Vector3(100, 100, 100),
    //   target: objectManager.get('maze')
    // }))
    this.add(new Square())
    super.init()
  }

  update() {
    const delta = stateManager.getClock().getDelta()
    //this.cameraControls.update(delta)
    super.update()
  }

  render() {
    super.render()
  }
}

export default MainScene