const source = `
  precision mediump float;
  
  attribute vec3 aPos;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  
  uniform float uTime;
  uniform mat4 pMatrix, vMatrix, mMatrix;
  
  void main() {
    vTexCoord = aTexCoord;
    gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPos, 1.0);
  }
`
export default source