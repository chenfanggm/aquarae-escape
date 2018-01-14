import objectManager from '../managers/objectManager'
import socketService from '../services/socketService'
import Scene from '../entities/Scene'
import Plane from '../objects/Plane'
import Susan from '../objects/Susan'
import Hero from '../objects/Hero'
import Cube from '../objects/Cube'
import PlayerController from '../scripts/PlayerController'
import AgentController from '../scripts/AgentController'
import gameManager from "../managers/gameManager";


class MainScene extends Scene {
  constructor(id) {
    super(id)
    this.receivedCMDHandler = this.receivedCMDHandler.bind(this)
  }

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
    const plane = new Plane({
      width: 20,
      height: 20
    })
    this.addChild(plane)

    const susan = new Susan({
      transform: { position: [0, 1, 0] }
    })
    this.addChild(susan)

    socketService.registerCMDHandler(this.receivedCMDHandler)
    super.init()
  }

  receivedCMDHandler(cmd) {
    switch (cmd.type) {
      case 'spawn': {
        const player = gameManager.getGame().getCurPlayer()
        if (cmd.userId !== player.id) {
          console.log('Received CMD spawn:', cmd)
          this.spawnOtherPlayer({id: cmd.userId, position: cmd.data.pos})
        }
      }
        break
      default:
        break
    }
  }

  spawnPlayer({id, position}) {
    const player = new Hero({
      id,
      name: 'player',
      transform: { position }
    })
    player.addComponent(new PlayerController(player))
    player.init()
    this.addChild(player)
    console.log('Player spawned!')
  }

  spawnOtherPlayer({id, position}) {
    const spawned = new Cube({
      id,
      transform: { position }
    })
    spawned.addComponent(new AgentController(spawned))
    spawned.init()
    this.addChild(spawned)
  }
}

export default MainScene