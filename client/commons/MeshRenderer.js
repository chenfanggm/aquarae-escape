import GameComponent from './GameComponent'


class MeshRenderer extends GameComponent {
  constructor(mesh, material) {
    super()
    this.mesh = mesh
    this.material = material
  }

  render() {
    // bind
    this.material.program.enable()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.vertexBuffer)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.mesh.texBuffer)
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.drawElements(this.mesh.primitiveType, this.mesh.indices.length, this.gl.UNSIGNED_SHORT, 0)
    // clear
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.material.program.disable()
  }

}

export default MeshRenderer