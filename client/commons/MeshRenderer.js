import * as glm from './libs/gl-matrix'
import GameComponent from './GameComponent'


class MeshRenderer extends GameComponent {
  constructor(owner) {
    super(owner)
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
    this.material.program.enableAttr('aVertCoord', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 5, 0)
    this.material.program.enableAttr('aTexCoord', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3)
    // bind indices
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW)
    // bind texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.material.texBuffer)
    this.gl.activeTexture(this.gl.TEXTURE0)
    // set mvp matrix
    glm.mat4.lookAt(this.vMatrix, new Float32Array([0, 0, -5]), [0, 0, 0], [0, 1, 0])
    glm.mat4.perspective(this.pMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width/aquarae.canvas.height, 0.1, 1000.0)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.material.program.disable()
  }

  update() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.genMVPMatrix()
    this.material.program.enable()
    this.material.program.setMatrixUniform('mvpMatrix', this.mvpMatrix)
    this.clear()
  }

  render() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.material.texBuffer)
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.material.program.enable()
    this.gl.drawElements(this.mesh.primitiveType, this.mesh.indices && this.mesh.indices.length || this.mesh.vertexCount, this.gl.UNSIGNED_SHORT, 0)
    this.clear()
  }

  clear() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.material.program.disable()
  }

  genMVPMatrix() {
    glm.mat4.identity(this.mvpMatrix)
    glm.mat4.mul(this.mvpMatrix, this.mvpMatrix, this.owner.transform.getTransformMatrix())
    glm.mat4.mul(this.mvpMatrix, this.vMatrix, this.mvpMatrix)
    glm.mat4.mul(this.mvpMatrix, this.pMatrix, this.mvpMatrix)
  }
}

export default MeshRenderer