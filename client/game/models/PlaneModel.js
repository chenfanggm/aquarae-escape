import Model from '../entities/Model';
import resourceManager from '../managers/resourceManager';


export default class PlaneModel extends Model {
  constructor(opts = {}) {
    super(opts);
    const { width, height, widthSegments, heightSegments } = opts;
    this.name = 'plane';
    this.width = width || 1;
    this.height = height || 1;
    this.widthSegments = (widthSegments && Math.floor(widthSegments)) || 1;
    this.heightSegments = (heightSegments && Math.floor(heightSegments)) || 1;
    this.mesh = this.generatePlane(this.width, this.height, this.widthSegments, this.heightSegments);
  }
  
  preload() {
    return Promise.all([
      resourceManager.loadImage('/textures/tile/tile_sand.jpg')
        .then((image) => {
          this.textures.push(image);
        })
    ]);
  }

  generatePlane(width, height, widthSegments, heightSegments) {
    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const gridX = widthSegments;
    const gridZ = heightSegments;
    const gridX1 = gridX + 1;
    const gridZ1 = gridZ + 1;
    const unitWidth = width / gridX;
    const unitHeight = height / gridZ;
    // buffers
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // generate vertices, normals and uvs
    for ( let iz = 0; iz < gridZ1; iz++ ) {
      const z = iz * unitHeight - heightHalf;
      for ( let ix = 0; ix < gridX1; ix++ ) {
        const x = ix * unitWidth - widthHalf;
        vertices.push(x, 0, z);
        normals.push(0, 1, 0);
        uvs.push(ix / gridX);
        uvs.push(iz / gridZ);
      }
    }

    // indices
    for (let iz = 0; iz < gridZ; iz++ ) {
      for (let ix = 0; ix < gridX; ix++ ) {
        const a = ix + gridX1 * iz;
        const b = ix + gridX1 * ( iz + 1 );
        const c = (ix + 1) + gridX1 * (iz + 1);
        const d = ( ix + 1 ) + gridX1 * iz;
        // faces
        indices.push( a, b, d );
        indices.push( b, c, d );
      }
    }

    return {
      vertices,
      normals,
      indices,
      uvs
    };
  }
}