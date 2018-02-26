import * as glm from '../libs/gl-matrix';
import sceneManager from '../managers/sceneManager';
import gameManager from '../managers/gameManager';
import DirectLight from './DirectLight';


class MeshRenderer {
  constructor(owner, program) {
    this.gl = aquarae.gl;
    this.owner = owner;
    this.program = program;
    this.modelMatrix = glm.mat4.create();
    this.viewMatrix = glm.mat4.create();
    this.projMatrix = glm.mat4.create();
    this.ambientColor = [0.2, 0.2, 0.2];
    this.sunPosition = [15, 15, 15];
    this.sunIntensity = [0.9, 0.9, 0.9];
    this.sunColor = [1.0, 1.0, 1.0];
  }

  render() {
    this.computeMatrix();
    this.gl.drawElements(this.gl.TRIANGLES, this.owner.model.indexCount, this.gl.UNSIGNED_SHORT, 0);
  }

  computeMatrix() {
    // model
    glm.mat4.identity(this.modelMatrix);
    glm.mat4.mul(this.modelMatrix, this.modelMatrix, this.owner.transform.getMatrix());

    // view
    const mainCamera = sceneManager.getCurScene().getCamera('mainCamera');
    glm.mat4.lookAt(this.viewMatrix, mainCamera.transform.position, [0, 0, 0], [0, 1, 0]);

    // projection
    const game = gameManager.getGame();
    glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), game.canvas.width / game.canvas.height, 0.1, 1000.0);
    this.program.setMatrixUniform('modelMatrix', this.modelMatrix);
    this.program.setMatrixUniform('viewMatrix', this.viewMatrix);
    this.program.setMatrixUniform('projMatrix', this.projMatrix);

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
    this.program.setVec3Uniform('fogColor', curScene.clearColor);
    this.program.setVec3Uniform('ambientColor', this.ambientColor);
    this.program.setVec3Uniform('sunLight.position', this.sunPosition);
    this.program.setVec3Uniform('sunLight.color', this.sunColor);
    this.program.setFloatUniform('sunLight.intensity', this.sunIntensity);
    this.program.setFloatUniform('shineDamper', this.owner.model.material.shineDamper);
    this.program.setFloatUniform('reflectivity', this.owner.model.material.reflectivity);
    this.program.setFloatUniform('isHasFakeLighting', this.owner.model.isHasFakeLighting ? 1 : 0);
  }
}

export default MeshRenderer;