class CameraManager {
  constructor() {
    this.cameras = {};
  }

  add(id, camera) {
    this.cameras[id] = camera;
  }

  get(id) {
    if (this.cameras[id]) return this.cameras[id];
    throw new Error(`not existing camera with id: ${id}`);
  }

  setMainCamera(camera) {
    return this.cameras.mainCamera = camera;
  }

  getMainCamera() {
    return this.cameras.mainCamera;
  }

  getAll() {
    return Object.values(this.cameras);
  }

  reset() {
    Object.values(this.cameras).forEach((camera) => {
      camera.reset();
    });
    this.cameras = {};
  }
}

const cameraManager = new CameraManager();
export default cameraManager;