const source = `
  precision mediump float;
  attribute vec2 pos;
  void main() {
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`
export default source