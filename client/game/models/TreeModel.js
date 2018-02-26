import Model from '../entities/Model';
import resourceManager from '../managers/resourceManager';


export default class TreeModel extends Model {
  constructor(opts) {
    super(opts);
    this.name = 'plane';
  }
  
  preload() {
    return Promise.all([
      resourceManager.loadJson('/models/tree/tree.json')
        .then((model) => {
          const mesh = model.meshes[0];
          this.mesh = {};
          this.mesh.vertices = mesh.vertices;
          this.mesh.indices = [].concat.apply([], mesh.faces);
          this.mesh.normals = mesh.normals;
          this.mesh.uvs = mesh.texturecoords[0];
        })
    ]);
  }
}