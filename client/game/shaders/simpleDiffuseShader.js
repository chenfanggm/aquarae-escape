
const vSource = `
  precision mediump float;
  
  attribute vec3 aVertPosition;
  attribute vec2 aVertTexCoord;
  attribute vec3 aVertNormal;
  varying vec2 vFragTexCoord;
  varying vec3 vFragNormal;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;
  
  void main() {
    vFragTexCoord = aVertTexCoord;
    vFragNormal = (modelMatrix * vec4(aVertNormal, 0.0)).xyz;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertPosition, 1.0);
  }
`;

const fSource = `
  precision mediump float;
  
  struct DirectionalLight {
    vec3 direction;
    vec3 intensity;
  };
  
  varying vec2 vFragTexCoord;
  varying vec3 vFragNormal;
  
  uniform vec3 ambientIntensity;
  uniform DirectionalLight sunLight;
  uniform sampler2D sampler;
  
  void main() {
    vec3 surfaceNormal = normalize(vFragNormal);
    vec3 normalizedSunDirection = normalize(sunLight.direction);
    vec4 texel = texture2D(sampler, vFragTexCoord);
  
    vec3 lightIntensity = ambientIntensity + sunLight.intensity * max(dot(surfaceNormal, normalizedSunDirection), 0.0);
  
    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
  }
`;

export default {
  id: 'simpleDiffuseShader',
  vSource,
  fSource
};