
const vSource = `#version 300 es
  precision mediump float;

  in vec2 vPosition;
  in vec2 vTexture;
  out vec2 vTexCoords;
  uniform mat4 projMatrix;
  uniform vec2 startXY;  // pos. of the first character

  void main() {
    vTexCoords = vTexture;
    gl_Position = projMatrix * vec4(vPosition + startXY, 0.0, 1.0);
  }
`;

const fSource = `#version 300 es
  precision mediump float;

  in vec2 vTexCoords;
  out vec4 outColor;
  uniform sampler2D font;
  uniform vec3 fontColor;

  void main() {
    vec4 sampled = texture(font, vTexCoords);
    outColor = vec4(fontColor, sampled.r);
  }
`;

export default {
  name: 'bitmapFontShader',
  vSource,
  fSource
};
