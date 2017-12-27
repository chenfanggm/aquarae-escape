import * as glm from '../../../commons/libs/gl-matrix'
import sceneManager from '../../../commons/managers/sceneManager'
import stateManager from '../../../commons/managers/stateManager'
import shaderManager from '../../../commons/managers/shaderManager'
import GameObject from '../../../commons/GameObject'
import ShaderProgram from '../../../commons/ShaderProgram'
import MeshRenderer from '../../../commons/MeshRenderer'
import utils from '../../../commons/utils'


class Cube extends GameObject {
  constructor() {
    super()
    this.isFinishLoading = false
    this.angle = 0
    this.material = {
      program: new ShaderProgram([
        shaderManager.get('simpleVertexShader'),
        shaderManager.get('simpleFragmentShader')
      ])
    }
    this.mesh = {
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      texBuffer: this.gl.createTexture(),
      vertexCount: 24,
      primitiveType: this.gl.TRIANGLES,
      vertices: [
        // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,
        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,
        // Right
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,
        // Front
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,    1, 0,
        -1.0, -1.0, 1.0,    0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,    0, 1,
        -1.0, -1.0, -1.0,    1, 1,
        -1.0, 1.0, -1.0,    1, 0,
        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
      ],
      indices: [
        // Top
        0, 1, 2,
        0, 2, 3,
        // Left
        5, 4, 6,
        6, 4, 7,
        // Right
        8, 9, 10,
        8, 10, 11,
        // Front
        13, 12, 14,
        15, 14, 12,
        // Back
        16, 17, 18,
        16, 18, 19,
        // Bottom
        21, 20, 22,
        22, 20, 23
      ]
    }

    this.preload()
    this.addComponent(new MeshRenderer(this.mesh, this.material))
  }

  preload() {
    utils.loadTexture('/textures/wood_crate.png', this.mesh, () => {
      this.isFinishLoading = true
    })
  }

  init() {
    this.material.program.init()
    // bind
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW)
    this.material.program.enableAttr('aPos', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 5, 0)
    this.material.program.enableAttr('aTexCoord', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3)

    this.pMatrix = glm.mat4.create()
    this.vMatrix = glm.mat4.create()
    this.mMatrix = glm.mat4.create()
    glm.mat4.perspective(this.pMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width/aquarae.canvas.height, 0.1, 1000.0)
    glm.mat4.lookAt(this.vMatrix, new Float32Array([0, 0, -5]), [0, 0, 0], [0, 1, 0])

    this.material.program.enable()
    this.material.program.setMatrixUniform('pMatrix', this.pMatrix)
    this.material.program.setMatrixUniform('vMatrix', this.vMatrix)
    this.material.program.setMatrixUniform('mMatrix', this.mMatrix)
    // clear
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.material.program.disable()
    super.init()
  }

  input() {
    super.input()
  }

  update() {
    if (this.isFinishLoading) {
      // bind
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
      this.material.program.enable()
      // update
      const elapsedTime = stateManager.getTimeElapsed()
      this.material.program.setFloatUniform('uTime', elapsedTime)

      this.angle += stateManager.getDelta() / 1000 / 6 * 2 * Math.PI
      if (this.angle > 360) this.angle -= 360
      glm.mat4.rotate(this.mMatrix, utils.getIdentityMatrix(), this.angle, [0, 1, 0])
      this.material.program.setMatrixUniform('mMatrix', this.mMatrix)
      // clear
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.material.program.disable()
      super.update()
    }
  }

  render() {
    if (this.isFinishLoading) {
      super.render()
    }
  }

  reset() {
    sceneManager.getCurScene().remove(this)
    super.reset()
  }
}

export default Cube