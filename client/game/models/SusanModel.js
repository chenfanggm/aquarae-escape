import Model from '../entities/Model';
import resourceManager from '../managers/resourceManager';


export default class SusanModel extends Model {
  constructor(opts) {
    super(opts);
    this.name = 'susan';
  }
  
  preload() {
    return Promise.all([
      resourceManager.loadJson('/models/susan/susan.json')
        .then((response) => {
          const mesh = response.meshes[0];
          this.mesh = {};
          this.mesh.vertices = mesh.vertices;
          this.mesh.indices = [].concat.apply([], mesh.faces);
          this.mesh.normals = mesh.normals;
          this.mesh.uvs = mesh.texturecoords[0];
        }),
      resourceManager.loadImage('/models/susan/susan.png')
        .then((image) => {
          image.isFlipY = true;
          this.textures.push(image);
        })
    ]);
  }
}