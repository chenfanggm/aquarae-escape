import dat from 'dat-gui'
import * as THREE from 'three'
import '../../../commons/libs/OrbitAndPanControls.new'
import Scene from '../../../commons/Scene'
import Maze from '../objects/Maze/Maze'
import AmbientLight from '../objects/AmbientLight'
import DirectionalLight from '../objects/DirectionalLight'
import objectManager from '../../../commons/managers/objectManager'
import stateManager from '../../../commons/managers/stateManager'
import simpleVertexShader from '../shaders/simpleVertexShader'
import simpleFragmentShader from '../shaders/simpleFragmentShader'


class MainScene extends Scene {
  init() {
    // // camera
    // const mainCamera = objectManager.get('mainCamera')
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
    const program = this.createProgram(this.gl, [
      {source: simpleVertexShader, type: this.gl.VERTEX_SHADER},
      {source: simpleFragmentShader, type: this.gl.FRAGMENT_SHADER}
    ])
    this.gl.useProgram(program)

    const squareVertices = [
      +0.75, +0.75,
      -0.75, +0.75,
      +0.75, -0.75,
      -0.75, -0.75
    ]

    const square = {
      vertexCount: 4,
      primitiveType: this.gl.TRIANGLE_STRIP
    }

    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    program.positionAttribute = this.gl.getAttribLocation(program, 'pos')
    this.gl.enableVertexAttribArray(program.positionAttribute)
    this.gl.vertexAttribPointer(program.positionAttribute, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(squareVertices), this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.useProgram(null)
    square.vertexBuffer = vertexBuffer

    this.program = program
    this.object = square

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

  createProgram(gl, shaderSpecs) {
    const program = gl.createProgram()
    for (let i = 0;  i < shaderSpecs.length; i++) {
      const spec = shaderSpecs[i]
      const source = spec.source
      const shader = gl.createShader(spec.type)

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(shader)

      gl.attachShader(program, shader)
      gl.deleteShader(shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw gl.getProgramInfoLog(program)
    return program
  }
}

export default MainScene