const vSource = `#version 300 es
  precision mediump float;
  
  struct DirectLight {
    vec3 position;
    vec3 color;
    float intensity;
  };
  
  layout(location = 0) in vec3 vPosition;
  layout(location = 1) in vec2 vTexture;
  layout(location = 2) in vec3 vNormal;  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projMatrix;
  uniform DirectLight sunLight;
  
  out vec2 fTexture;
  out vec3 fNormal;
  out vec3 fToSunVector;
  
  void main() {
    vec4 worldPosition = modelMatrix * vec4(vPosition, 1.0);    
    fNormal = (modelMatrix * vec4(vNormal, 0.0)).xyz;
    fToSunVector = sunLight.position - worldPosition.xyz;
    fTexture = vTexture;

    gl_Position = projMatrix * viewMatrix * worldPosition;
  }
`;

const fSource = `#version 300 es
  precision mediump float;
  
  struct DirectLight {
    vec3 position;
    vec3 color;
    float intensity;
  };
  
  in vec2 fTexture;
  in vec3 fNormal;
  in vec3 fToSunVector;
  uniform vec3 ambientIntensity;
  uniform DirectLight sunLight;
  uniform sampler2D sampler;
  
  out vec4 outColor;
  
  void main() {
    vec3 normalizedSurfaceNormal = normalize(fNormal);
    vec3 normalizedToSunVector= normalize(fToSunVector);    
    float nDotL = dot(normalizedSurfaceNormal, normalizedToSunVector);
    float brightness = max(nDotL, 0.0);
    vec3 diffuse = vec3(sunLight.intensity) * brightness * sunLight.color;
    
    vec3 lightMix = ambientIntensity + diffuse;
    vec4 textureColor = texture(sampler, fTexture);
    outColor = vec4(lightMix, 1.0) * textureColor;
  }
`;

export default {
  id: 'simpleDiffuseShader',
  vSource,
  fSource
};