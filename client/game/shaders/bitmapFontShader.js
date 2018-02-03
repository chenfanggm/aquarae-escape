
const vSource = `
  precision mediump float;

  attribute vec2 vertex;
  attribute vec2 texcoords;

  varying vec2 TexCoords;
  
  uniform mat4 projection;
  uniform vec2 startXY;  // pos. of the first character

  void main() {
    vec4 projected = projection * vec4(vertex + startXY, 0.0, 1.0);
    gl_Position = projected;
    TexCoords = texcoords;
  }
`;

const fSource = `
  precision mediump float;

  varying vec2 TexCoords;
  //varying vec4 color;

  uniform sampler2D font;
  uniform vec3 fontColor;

  void main() {
    vec4 sampled = texture2D(font, TexCoords);
    gl_FragColor = vec4(fontColor, sampled.r);
  }
`;

export default {
  id: 'bitmapFontShader',
  vSource,
  fSource
};
