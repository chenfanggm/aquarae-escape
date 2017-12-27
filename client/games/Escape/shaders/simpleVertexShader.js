const source = `
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
export default source