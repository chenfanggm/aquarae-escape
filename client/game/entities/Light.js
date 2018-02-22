import GameObject from './GameObject';


class Light extends GameObject {
  constructor(opts) {
    super(opts);
    this.color = opts.color || [255, 255, 255];
    this.intensity = opts.intensity || 1;
  }
}

export default Light;