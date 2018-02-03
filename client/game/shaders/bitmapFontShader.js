
const vSource = `
  precision mediump float;

  attribute vec2 aVertPosition;
  attribute vec2 aVertTexCoord;
  varying vec2 vTexCoords;
  
  uniform mat4 projMatrix;
  uniform vec2 startXY;  // pos. of the first character

  void main() {
    vTexCoords = aVertTexCoord;
    gl_Position = projMatrix * vec4(aVertPosition + startXY, 0.0, 1.0);
  }
`;

const fSource = `
  precision mediump float;

  varying vec2 vTexCoords;

  uniform sampler2D font;
  uniform vec3 fontColor;

  void main() {
    vec4 sampled = texture2D(font, vTexCoords);
    gl_FragColor = vec4(fontColor, sampled.r);
  }
`;

export default {
  id: 'bitmapFontShader',
  vSource,
  fSource
};
