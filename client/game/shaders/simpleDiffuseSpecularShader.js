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
  uniform float isHasFakeLighting;
  
  out vec2 fTexture;
  out vec3 fNormal;
  out vec3 fToSunVector;
  out vec3 fToCameraVector;
  out float fVisibility;

  const float fogDensity = 0.03;
  const float fogGradient = 3.0;
  
  void main() {
    vec4 worldPosition = modelMatrix * vec4(vPosition, 1.0);    
    vec4 viewPosition = viewMatrix * worldPosition;
    vec3 actualNormal = vNormal;
    if(isHasFakeLighting > 0.5) {
      actualNormal = vec3(0.0, 1.0, 0.0);
    }
    
    fNormal = (modelMatrix * vec4(actualNormal, 0.0)).xyz;
    fToSunVector = sunLight.position - worldPosition.xyz;
    fToCameraVector = (inverse(viewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz - worldPosition.xyz;
    
    float viewDistance = length(viewPosition.xyz);
    fVisibility = exp(-pow((viewDistance * fogDensity), fogGradient));
    fVisibility = clamp(fVisibility, 0.0, 1.0);
    
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
  in vec3 fToCameraVector;
  in float fVisibility;
  uniform vec3 fogColor;
  uniform vec3 ambientColor;
  uniform float shineDamper;
  uniform float reflectivity;
  uniform DirectLight sunLight;
  uniform sampler2D sampler;
  
  out vec4 outColor;
  
  void main() {
    vec3 normalizedSurfaceNormal = normalize(fNormal);
    vec3 normalizedToSunVector = normalize(fToSunVector);  
    vec3 normalizedSunDirection = -normalizedToSunVector;
    vec3 normalizedToCameraVector = normalize(fToCameraVector);
    vec3 normalizedReflectedSunDirection = reflect(normalizedSunDirection, normalizedSurfaceNormal);

    float diffuseFactor = dot(normalizedSurfaceNormal, normalizedToSunVector);
    float brightness = max(diffuseFactor, 0.0);
    vec3 diffuseColor = vec3(sunLight.intensity) * brightness * sunLight.color;
    vec3 lightColor = ambientColor + diffuseColor;    

    float specularFactor = dot(normalizedReflectedSunDirection, normalizedSurfaceNormal);
    specularFactor = max(specularFactor, 0.0);
    float dampedFactor = pow(specularFactor, shineDamper);    
    vec3 specularColor = dampedFactor * reflectivity * lightColor;
    
    vec4 textureColor = texture(sampler, fTexture);
    if (textureColor.a < 0.5) {
      discard;
    }
    
    outColor = vec4(lightColor, 1.0) * textureColor + vec4(specularColor, 1.0);
    outColor = mix(vec4(fogColor, 1.0), outColor, fVisibility);
  }
`;

export default {
  name: 'simpleDiffuseSpecularShader',
  vSource,
  fSource
};