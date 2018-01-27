
const vSource = `
  #version 330

  layout (location = 0) in vec2 vertex;
  layout (location = 1) in vec2 texcoords;

  uniform mat4 projection;
  uniform vec2 screenXY;

  out vec2 TexCoords;

  void main() {
    gl_Position = projection * vec4(vertex + screenXY, 0.0, 1.0);
    TexCoords = texcoords;
  }
`

const fSource = `
  #version 330

  in vec2 TexCoords;
  out vec4 color;

  uniform sampler2D font;
  uniform vec3 fontColor;

  void main() {
//    vec4 sampled = texture(font, TexCoords);
//    color = vec4(fontColor, 1.0) * sampled.r;
    color = vec4(0.0f, 0.0f, 1.0f, 1.0f);
  }
`

export default {
  id: 'bitmapFontShader',
  vSource,
  fSource
}
