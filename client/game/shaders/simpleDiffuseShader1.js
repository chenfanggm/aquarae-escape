
const vSource = `
  precision mediump float;
  
  attribute vec3 aVertCoord;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  
  uniform mat4 mvpMatrix;
  
  void main() {
    vTexCoord = aTexCoord;
    gl_Position = mvpMatrix * vec4(aVertCoord, 1.0);
  }
`

const fSource = `
  precision mediump float;
  
  varying vec2 vTexCoord;
  uniform sampler2D sampler;
  
  void main() {
    gl_FragColor = texture2D(sampler, vTexCoord);
  }
`

export default {
  id: 'simpleDiffuseShader1',
  vSource,
  fSource
}