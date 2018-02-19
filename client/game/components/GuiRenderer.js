import * as glm from '../libs/gl-matrix';
import GameComponent from '../entities/GameComponent';
import resourceManager from '../managers/resourceManager';
import inputManager from '../managers/inputManager';

class GuiRenderer extends GameComponent {
  constructor(owner, program) {
    super(owner);
    this.program = program;
    this.message = owner.message;
    this.position = owner.position;
    this.CHAR_WIDTH = 12;
    this.CHAR_HEIGHT = 16;
    this.width = this.message.length * this.CHAR_WIDTH;
    this.height = this.CHAR_HEIGHT;
    this.color = owner.color || [0.4, 0.8, 0.2];
    this.textureBuffers = [];
    this.projMatrix = glm.mat4.create();
    this.textures = [];

    this.texture = resourceManager.loadImage('/textures/font/font.jpg')
      .then((data) => {
        this.textures.push({
          data
        });
      });

    inputManager.on(this, 'click', (event) => {
      console.log('clicked hello world');
    });
  }

  init() {
    this.vertices = [];
    this.uvs = [];

    let curr_x = 0;
    for (let i = 0; i < this.message.length; i++) {
      const idx = this.message.charCodeAt(i);
      // vertex
      const x0 = 0, x1 = x0 + this.CHAR_HEIGHT, y0 = 0, y1 = y0 - this.CHAR_HEIGHT;
      const v = [x0,y0, x1,y1, x1,y0, x0,y0, x0,y1, x1,y1];
      // uvs
      const row = Math.floor(idx / this.CHAR_HEIGHT), col = idx - row * this.CHAR_HEIGHT;
      const tx0 = col / this.CHAR_HEIGHT, dt = 1.0 / this.CHAR_HEIGHT, tx1 = tx0 + dt;
      const ty0 = row / this.CHAR_HEIGHT, ty1 = ty0 + dt;
      const uv = [tx0,ty0, tx1,ty1, tx1,ty0, tx0,ty0, tx0,ty1, tx1,ty1];

      for (let j = 0; j < 6; j++) {
        this.vertices.push(v[j * 2] + curr_x); this.vertices.push(v[j * 2 + 1]); // X, Y
        this.uvs.push(uv[j * 2]); this.uvs.push(uv[j * 2 + 1]); // TX, TY
      }
      curr_x += this.CHAR_WIDTH;
    }
    this.initVAO();
    super.init();
  }

  render() {
    this.gl.clearColor(1,1,0.8,1);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.program.enable();
    this.textureBuffers.forEach((textureBuffer, index) => {
      this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
    });
    this.gl.bindVertexArray(this.vao);
    this.computeMatrix();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.message.length * 6);
    this.gl.bindVertexArray(null);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.BLEND);
    this.program.disable();
  }

  initVAO() {
    // vao
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // vertex
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    this.program.enableAttr('vPosition', this.gl.FLOAT, 2, 0, 0);

    // uvs
    if (this.uvs) {
      const uvBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.uvs), this.gl.STATIC_DRAW);
      this.program.enableAttr('vTexture', this.gl.FLOAT, 2, 0, 0);
    }

    // textures
    if (this.textures) {
      this.textures.forEach((texture) => {
        const textureBuffer = this.gl.createTexture();
        this.textureBuffers.push(textureBuffer);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, texture.isFlipY || false);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texture.data.width, texture.data.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      });
    }

    // clean
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  computeMatrix() {
    glm.mat4.identity(this.projMatrix);
    glm.mat4.ortho(this.projMatrix, 0, this.game.width, 0, this.game.height, -1, 1);
    this.program.setMatrixUniform('projMatrix', this.projMatrix);
    const xy = glm.vec2.fromValues(this.position[0], this.game.height - this.position[1]);
    this.program.setVec2Uniform('startXY', xy);
    const fontColor = glm.vec3.fromValues(this.color[0], this.color[1], this.color[2]);
    this.program.setVec3Uniform('fontColor', fontColor);
  }
}

export default GuiRenderer;
