
const vSource = `
  precision mediump float;
  
  attribute vec3 vertPosition;
  attribute vec2 vertTexCoord;
  attribute vec3 vertNormal;
  varying vec2 fragTexCoord;
  varying vec3 fragNormal;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;
  
  void main() {
    fragTexCoord = vertTexCoord;
    fragNormal = (modelMatrix * vec4(vertNormal, 0.0)).xyz;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertPosition, 1.0);
  }
`;

const fSource = `
  precision mediump float;
  
  struct DirectionalLight {
    vec3 direction;
    vec3 intensity;
  };
  
  varying vec2 fragTexCoord;
  varying vec3 fragNormal;
  
  uniform vec3 ambientIntensity;
  uniform DirectionalLight sunLight;
  uniform sampler2D sampler;
  
  void main() {
    vec3 surfaceNormal = normalize(fragNormal);
    vec3 normalizedSunDirection = normalize(sunLight.direction);
    vec4 texel = texture2D(sampler, fragTexCoord);
  
    vec3 lightIntensity = ambientIntensity + sunLight.intensity * max(dot(surfaceNormal, normalizedSunDirection), 0.0);
  
    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
  }
`;

export default {
  id: 'simpleDiffuseShader',
  vSource,
  fSource
};