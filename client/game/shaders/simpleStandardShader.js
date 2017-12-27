
const vSource = `
  precision mediump float;
  
  attribute vec3 aVertCoord;
  attribute vec3 aColorCoord;

  varying vec3 vColorCoord;
  uniform mat4 mvpMatrix;
  
  void main() {
    vColorCoord = aColorCoord;
    gl_Position = mvpMatrix * vec4(aVertCoord, 1.0);
  }
`

const fSource = `
  precision mediump float;
  
  varying vec3 vColorCoord;
  
  void main() {
    gl_FragColor = vec4(vColorCoord, 1);
  }
`

export default {
  id: 'simpleStandardShader',
  vSource,
  fSource
}