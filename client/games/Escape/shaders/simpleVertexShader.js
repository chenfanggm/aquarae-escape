const source = `
  precision mediump float;
  
  attribute vec3 pos;
  attribute vec3 color;
  varying vec3 vColor;
  
  uniform float uTime;
  uniform mat4 pMatrix, vMatrix, mMatrix;
  
  void main() {
    vColor = color;
    float y = pos.y + sin(uTime * 3.141592653589793 / 1800.0) / 4.0;
    gl_Position = pMatrix * vMatrix * mMatrix * vec4(pos.x, y, pos.z, 1.0);
  }
`
export default source