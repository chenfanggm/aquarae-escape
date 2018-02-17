const vSource = `#version 300 es
  precision mediump float;
  
  layout(location = 0) in vec3 vPosition;
  layout(location = 1) in vec2 vTexture;
  layout(location = 2) in vec3 vNormal;
  out vec2 fTexture;
  out vec3 fragNormal;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;
  
  void main() {
    fTexture = vTexture;
    fragNormal = (modelMatrix * vec4(vNormal, 0.0)).xyz;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
  }
`;

const fSource = `#version 300 es
  precision mediump float;
  
  struct DirectionalLight {
    vec3 direction;
    vec3 intensity;
  };
  
  in vec2 fTexture;
  in vec3 fragNormal;
  out vec4 outColor;
  uniform vec3 ambientIntensity;
  uniform DirectionalLight sunLight;
  uniform sampler2D sampler;
  
  void main() {
    vec3 surfaceNormal = normalize(fragNormal);
    vec3 normalizedSunDirection = normalize(sunLight.direction);
    vec4 texel = texture(sampler, fTexture);
  
    vec3 lightIntensity = ambientIntensity + sunLight.intensity * max(dot(surfaceNormal, normalizedSunDirection), 0.0);
  
    outColor = vec4(texel.rgb * lightIntensity, texel.a);
  }
`;

export default {
  id: 'simpleDiffuseShader',
  vSource,
  fSource
};