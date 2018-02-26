export default class Model {
  constructor(opts = {}) {
    const { mesh, textures, material } = opts;
    this.gl = aquarae.gl;
    this.mesh = mesh || null;
    this.indexCount = null;
    this.textures = textures || [];
    this.material = material || {
      shineDamper: 1,
      reflectivity: 0
    };
    this.isHasTransparency = false;
    this.isHasFakeLighting = false;
    this.vao = null;
    this.textureBuffers = [];
  }

  preload() {
    return Promise.resolve();
  }

  init(opts) {
    const { program } = opts;
    // vao
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // vertex
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW);
    program.enableAttr('vPosition', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0);

    // indices
    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW);
    this.indexCount = this.mesh.indices.length;

    // uvs
    if (this.mesh.uvs) {
      const uvBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.uvs), this.gl.STATIC_DRAW);
      program.enableAttr('vTexture', this.gl.FLOAT, 2, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    }

    // normal
    if (this.mesh.normals) {
      const normalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.gl.STATIC_DRAW);
      program.enableAttr('vNormal', this.gl.FLOAT, 3, Float32Array.BYTES_PER_ELEMENT * 3, 0);
    }

    // textures
    if (this.textures) {
      this.textures.forEach((texture) => {
        const textureBuffer = this.gl.createTexture();
        this.textureBuffers.push(textureBuffer);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureBuffer);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, texture.isFlipY || false);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texture.width, texture.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture);
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

  getVAO() {
    if (!this.vao) throw new Error('VAO not initiated!');
    return this.vao;
  }

  getTextureBuffers() {
    if (!this.textureBuffers) throw new Error('Texture buffer not initiated!');
    return this.textureBuffers;
  }
}