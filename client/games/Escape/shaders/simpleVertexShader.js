const source = `
  precision mediump float;
  attribute vec2 pos;
  attribute vec3 color;
  varying vec3 _color;
  uniform float time;
  void main() {
    _color = color;
    gl_Position = vec4(pos.xy, 0.0, 1.0);
  }
`
export default source