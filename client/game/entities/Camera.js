import GameObject from './GameObject';


class Camera extends GameObject {
  constructor(opts) {
    super(opts);
    const { name } = opts;
    if (!name) throw new Error('Name is required for creating camera');
    this.pitch = null;
    this.yaw = null;
    this.roll = null;
  }
}
export default Camera;