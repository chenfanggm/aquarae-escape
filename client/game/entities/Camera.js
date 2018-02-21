import GameObject from './GameObject';


class Camera extends GameObject {
  constructor(opts) {
    super(opts);
    this.pitch = null;
    this.yaw = null;
    this.roll = null;
  }
}
export default Camera;