import * as glm from '../libs/gl-matrix';
import GameComponent from './GameComponent';
import resourceManager from '../managers/resourceManager';
import inputManager from '../managers/inputManager';

class GuiRenderer extends GameComponent {
  constructor(owner) {
    super(owner);
    this.material = owner.material;
    this.message = owner.message;
    this.position = owner.position;
    this.width = this.message.length * 12;
    this.height = 16;

    this.vertexBuffer = this.gl.createBuffer();
    this.uvBuffer = this.gl.createBuffer();
    this.textureBuffer = this.gl.createTexture();
    this.projMatrix = glm.mat4.create();

    this.texture = resourceManager.loadImage('/textures/font/font.jpg')
      .then((image) => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBuffer);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      });

    inputManager.on(this, 'click', (event) => {
      console.log('clicked hello world');
    });
  }

  render() {
    this.gl.clearColor(1,1,0.8,1);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.material.program.enable();
    this.bindBufferData();
    this.computeMatrix();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.message.length * 6);
    this.clear();
  }

  clear() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.BLEND);
    this.material.program.disable();
  }

  bindBufferData() {
    // vertex
    const all_v = [], all_t = [];
    const DELTA_X = 12;

    let curr_x = 0;
    for (let i = 0; i < this.message.length; i++) {
      const idx = this.message.charCodeAt(i);

      const x0 = 0, x1 = x0 + 16, y0 = 0, y1 = y0 - 16;
      const v = [x0,y0, x1,y1, x1,y0, x0,y0, x0,y1, x1,y1];

      // uvs
      const row = Math.floor(idx / 16), col = idx - row * 16;
      const tx0 = col / 16, dt = 1.0 / 16, tx1 = tx0 + dt;
      const ty0 = row / 16, ty1 = ty0 + dt;
      const uvs = [tx0,ty0, tx1,ty1, tx1,ty0, tx0,ty0, tx0,ty1, tx1,ty1];

      for (let j = 0; j < 6; j++) {
        all_v.push(v[j * 2] + curr_x); all_v.push(v[j * 2 + 1]); // X, Y
        all_t.push(uvs[j * 2]);        all_t.push(uvs[j * 2 + 1]); // TX, TY
      }
      curr_x += DELTA_X;
    }


    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(all_v), this.gl.STATIC_DRAW);
    this.material.program.enableAttr('vertex', this.gl.FLOAT, 2, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(all_t), this.gl.STATIC_DRAW);
    this.material.program.enableAttr('texcoords', this.gl.FLOAT, 2, 0, 0);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBuffer);
    this.gl.activeTexture(this.gl.TEXTURE0);
  }

  computeMatrix() {
    glm.mat4.identity(this.projMatrix);
    glm.mat4.ortho(this.projMatrix, 0, this.game.width, 0, this.game.height, -1, 500);
    const xy = glm.vec2.fromValues(320, this.game.height - 160);
    this.material.program.setMatrixUniform('projection', this.projMatrix);
    this.material.program.setVec2Uniform('startXY', xy);
    const fontColor = glm.vec3.fromValues(1,0,0);
    this.material.program.setVec3Uniform('fontColor', fontColor);
  }
}

export default GuiRenderer;
