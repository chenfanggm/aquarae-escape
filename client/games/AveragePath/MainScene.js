import * as THREE from 'three'
import '../../commons/libs/OrbitAndPanControls.new'
import dat from 'dat-gui'
import Scene from "../../commons/Scene";
import getBigBall from '../../components/getBigBall'
import getSmallBall from '../../components/getSmallBall'
import _Coordinates from '../../commons/libs/Coordinates'


class MainScene extends Scene {
  constructor(opts) {
    super(opts)
    this.coordinates = {
      gridX: false,
      gridY: false,
      gridZ: true,
      axes: true,
      ground: false
    }
    this.gui = {
      newGridX: this.coordinates.gridX,
      newGridY: this.coordinates.gridY,
      newGridZ: this.coordinates.gridZ,
      newGround: this.coordinates.ground,
      newAxes: this.coordinates.axes
    }
  }

  init() {
    this.fillScene()
    this.drawGrids()
    this.setupGUI()
  }

  render() {
    if (this.gui.newGridX !== this.coordinates.gridX ||
      this.gui.newGridY !== this.coordinates.gridY ||
      this.gui.newGridZ !== this.coordinates.gridZ ||
      this.gui.newGround !== this.coordinates.ground ||
      this.gui.newAxes !== this.coordinates.axes) {

      this.coordinates.gridX = this.gui.newGridX
      this.coordinates.gridY = this.gui.newGridY
      this.coordinates.gridZ = this.gui.newGridZ
      this.coordinates.ground = this.gui.newGround
      this.coordinates.axes = this.gui.newAxes
      this.fillScene()
      this.drawGrids()
      this.setupGUI()
    }
  }

  fillScene() {
    this.scene.fog = new THREE.Fog(0x808080, 2000, 4000)

    // model
    this.game.objectService.add('smallBall', getSmallBall())
    this.game.objectService.add('bigBall', getBigBall())
    this.game.objectService.getAll().forEach((obj) => {
      this.scene.add(obj)
    })

    // light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    ambientLight.position.set(100, 100, 100)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(100, 100, 100 )
    directionalLight.target = this.game.objectService.get('smallBall')
    this.scene.add(directionalLight)
  }

  drawGrids() {
    // show grids
    const Coordinates = _Coordinates(this.scene)
    if (this.coordinates.ground) {
      Coordinates.drawGround({ size: 200 });
    }
    if (this.coordinates.gridX) {
      Coordinates.drawGrid({ size: 100, scale: 0.1 });
    }
    if (this.coordinates.gridY) {
      Coordinates.drawGrid({ size: 100, scale: 0.1, orientation: 'y' });
    }
    if (this.coordinates.gridZ) {
      Coordinates.drawGrid({ size: 100, scale: 0.1, orientation: 'z' });
    }
    if (this.coordinates.axes) {
      Coordinates.drawAllAxes({axisLength: 25, axisRadius: 0.2, axisTess: 10});
    }
  }

  setupGUI() {
    const gui = new dat.GUI();
    const h = gui.addFolder('Grid display');
    h.add(this.gui, 'newGridX').name('Show XZ grid');
    h.add(this.gui, 'newGridY' ).name('Show YZ grid');
    h.add(this.gui, 'newGridZ' ).name('Show XY grid');
    h.add(this.gui, 'newGround' ).name('Show ground');
    h.add(this.gui, 'newAxes' ).name('Show axes');
  }
}

export default MainScene