class SceneManager {
  constructor() {
    this.scenes = {}
    this.curScene = null
  }

  add(id, scene) {
    this.scenes[id] = scene
  }

  get(id) {
    if (this.scenes[id]) return this.scenes[id]
    throw new Error(`not existing scene with id: ${id}`)
  }

  setCurScene(scene) {
    return this.curScene = scene
  }

  getCurScene() {
    return this.curScene
  }

  getAll() {
    return Object.values(this.scenes)
  }

  reset() {
    Object.values(this.scenes).forEach((scene) => {
      scene.reset()
    })
    this.scenes = {}
  }

}

const sceneManager = new SceneManager()
export default sceneManager