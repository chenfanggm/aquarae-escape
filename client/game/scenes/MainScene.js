import Scene from '../../commons/Scene'
import Plane from '../objects/Plane'
import Cube from '../objects/Cube'
import Susan from '../objects/Susan'
import PlayerController from '../scripts/PlayerController'


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

    const susan = new Susan({
      position: [0, 1, 0]
    })
    this.addChild(susan)

    // const cube1 = new Cube({
    //   position: [-5, 0.5, -5]
    // })
    // this.addChild(cube1)

    const player = new Cube({
      position: [-2, 0.5, 2]
    })
    player.addComponent(new PlayerController(player))
    this.addChild(player)

    const plane = new Plane({
      width: 20,
      height: 20
    })
    this.addChild(plane)

    super.init()
  }
}

export default MainScene