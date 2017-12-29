import * as glm from './libs/gl-matrix'
import GameComponent from './GameComponent'


class MeshRenderer extends GameComponent {
  constructor(owner) {
    super(owner)
    this.owner = owner
    this.mesh = owner.mesh
    this.material = owner.material
    this.mvpMatrix = glm.mat4.create()
    this.vMatrix = glm.mat4.create()
    this.pMatrix = glm.mat4.create()
  }

  init() {
    // bind vertex
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW)
    this.material.program.enableAttr('aVertCoord', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0)
    // bind texture coord
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.texCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.texCoords), this.gl.STATIC_DRAW)
    this.material.program.enableAttr('aTexCoord', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 2, 0)
    // bind indices
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW)
    // set mvp matrix
    glm.mat4.lookAt(this.vMatrix, new Float32Array([0, 0, 5]), [0, 0, 0], [0, 1, 0])
    glm.mat4.perspective(this.pMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width/aquarae.canvas.height, 0.1, 1000.0)
    this.clear()
  }

  render() {
    this.material.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.material.program.enableAttr('aVertCoord', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.texCoordBuffer)
    this.material.program.enableAttr('aTexCoord', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 2, 0)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.mesh.texBuffer)
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.updateMVPMatrix()
    this.material.program.setMatrixUniform('mvpMatrix', this.mvpMatrix)
    this.gl.drawElements(this.mesh.primitiveType, this.mesh.indices.length, this.gl.UNSIGNED_SHORT, 0)
    this.clear()
  }

  clear() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.material.program.disable()
  }

  updateMVPMatrix() {
    glm.mat4.identity(this.mvpMatrix)
    glm.mat4.mul(this.mvpMatrix, this.mvpMatrix, this.owner.transform.getTransformMatrix())
    glm.mat4.mul(this.mvpMatrix, this.vMatrix, this.mvpMatrix)
    glm.mat4.mul(this.mvpMatrix, this.pMatrix, this.mvpMatrix)
  }
}

export default MeshRenderer