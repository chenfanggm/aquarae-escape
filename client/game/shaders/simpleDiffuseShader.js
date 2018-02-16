const vSource = `#version 300 es
  precision mediump float;
  
  in vec3 aVertPosition;
  in vec2 aVertTexCoord;
  in vec3 aVertNormal;
  out vec2 vFragTexCoord;
  out vec3 vFragNormal;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;
  
  void main() {
    vFragTexCoord = aVertTexCoord;
    vFragNormal = (modelMatrix * vec4(aVertNormal, 0.0)).xyz;
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertPosition, 1.0);
  }
`;

const fSource = `#version 300 es
  precision mediump float;
  
  struct DirectionalLight {
    vec3 direction;
    vec3 intensity;
  };
  
  in vec2 vFragTexCoord;
  in vec3 vFragNormal;
  out vec4 outColor;
  uniform vec3 ambientIntensity;
  uniform DirectionalLight sunLight;
  uniform sampler2D sampler;
  
  void main() {
    vec3 surfaceNormal = normalize(vFragNormal);
    vec3 normalizedSunDirection = normalize(sunLight.direction);
    vec4 texel = texture(sampler, vFragTexCoord);
  
    vec3 lightIntensity = ambientIntensity + sunLight.intensity * max(dot(surfaceNormal, normalizedSunDirection), 0.0);
  
    outColor = vec4(texel.rgb * lightIntensity, texel.a);
  }
`;

export default {
  id: 'simpleDiffuseShader',
  vSource,
  fSource
};