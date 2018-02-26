import * as glm from '../libs/gl-matrix';
import GameComponent from '../entities/GameComponent';
import sceneManager from '../managers/sceneManager';
import DirectLight from "../entities/DirectLight";


class MeshRenderer extends GameComponent {
  constructor(owner) {
    super(owner);
    this.indexCount = null;
    this.textureBuffers = [];
    this.modelMatrix = glm.mat4.create();
    this.viewMatrix = glm.mat4.create();
    this.projMatrix = glm.mat4.create();
    this.ambientColor = [0.2, 0.2, 0.2];
    this.sunPosition = [15, 15, 15];
    this.sunIntensity = [0.9, 0.9, 0.9];
    this.sunColor = [1.0, 1.0, 1.0];
  }

  render() {
    if (!this.indexCount) {
      this.indexCount = this.owner.model.mesh && this.owner.model.mesh.indices && this.owner.model.mesh.indices.length || null;
    }

    if (this.owner.model) {
      if (this.owner.model.isHasTransparency) {
        this.disableCulling();
      }
      this.owner.program.enable();
      this.owner.model.getTextureBuffers().forEach((textureBuffer, index) => {
        this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
      });
      this.gl.bindVertexArray(this.owner.model.getVAO());
      this.computeMatrix();
      this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
      this.enableCulling();
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      this.gl.bindVertexArray(null);
      this.owner.program.disable();
      if (this.owner.model.isHasTransparency) {
        this.enableCulling();
      }
    }
  }

  computeMatrix() {
    // model
    glm.mat4.identity(this.modelMatrix);
    glm.mat4.mul(this.modelMatrix, this.modelMatrix, this.owner.transform.getMatrix());
    // view
    const mainCamera = sceneManager.getCurScene().getCamera('mainCamera');
    glm.mat4.lookAt(this.viewMatrix, mainCamera.transform.position, [0, 0, 0], [0, 1, 0]);
    // projection
    glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), aquarae.canvas.width / aquarae.canvas.height, 0.1, 1000.0);
    this.owner.program.setMatrixUniform('modelMatrix', this.modelMatrix);
    this.owner.program.setMatrixUniform('viewMatrix', this.viewMatrix);
    this.owner.program.setMatrixUniform('projMatrix', this.projMatrix);
    // lights
    const curScene = sceneManager.getCurScene();
    const lights = curScene.getLights();
    lights.forEach((light) => {
      if (light instanceof DirectLight) {
        this.sunPosition = light.transform.position;
        this.sunColor = light.color;
        this.sunIntensity = light.intensity;
      }
    });
    this.owner.program.setVec3Uniform('fogColor', this.game.clearColor);
    this.owner.program.setVec3Uniform('ambientColor', this.ambientColor);
    this.owner.program.setVec3Uniform('sunLight.position', this.sunPosition);
    this.owner.program.setVec3Uniform('sunLight.color', this.sunColor);
    this.owner.program.setFloatUniform('sunLight.intensity', this.sunIntensity);
    this.owner.program.setFloatUniform('shineDamper', this.owner.model.material.shineDamper);
    this.owner.program.setFloatUniform('reflectivity', this.owner.model.material.reflectivity);
    this.owner.program.setFloatUniform('isHasFakeLighting', this.owner.model.isHasFakeLighting ? 1 : 0);
  }

  enableCulling() {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
  }

  disableCulling() {
    this.gl.disable(this.gl.CULL_FACE);

  }
}

export default MeshRenderer;