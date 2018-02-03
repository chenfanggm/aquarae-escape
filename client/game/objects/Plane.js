import timeManager from '../managers/timeManager';
import shaderManager from '../managers/shaderManager';
import resourceManager from '../managers/resourceManager';
import GameObject from '../entities/GameObject';
import MeshRenderer from '../entities/MeshRenderer';


class Plane extends GameObject {
  constructor(opts) {
    super(opts);
    const { width, height, widthSegments, heightSegments } = opts;
    this.width = width || 1;
    this.height = height || 1;
    this.widthSegments = Math.floor(widthSegments) || 1;
    this.heightSegments = Math.floor(heightSegments) || 1;

    this.material = {
      program: shaderManager.get('simpleDiffuseShader')
    };

    this.geometry = this.generatePlane(this.width, this.height, this.widthSegments, this.heightSegments);
    this.mesh = {
      ...this.mesh,
      ...this.geometry
    };
    this.addComponent(new MeshRenderer(this));
  }

  init() {
    this.preload().then(() => { super.init(); });
  }

  preload() {
    this.isReady = false;
    const promises = [
      resourceManager.loadAndApplyTexture('/textures/tile/tile_sand.jpg', this)
    ];
    return Promise.all(promises);
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
    let indices = [];
    let vertices = [];
    let normals = [];
    let uvs = [];

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
        let a = ix + gridX1 * iz;
        let b = ix + gridX1 * ( iz + 1 );
        let c = (ix + 1) + gridX1 * (iz + 1);
        let d = ( ix + 1 ) + gridX1 * iz;
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
    // build geometry
    // this.setIndex( indices )
    // this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    // this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) )
    // this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) )
  }
}

export default Plane;