const source = `
  precision mediump float;
  varying vec3 _color;
  void main() {
    gl_FragColor = vec4(_color, 1.0);
  }
`
export default source
