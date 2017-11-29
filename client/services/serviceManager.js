import SceneService from './SceneService'
import ObjectService from './ObjectService'


class ServiceManager {
  constructor() {
    this.availables = {
      sceneService: SceneService,
      objectService: ObjectService
    }

    this.services = {}
  }

  get(serviceName) {
    if (this.services[serviceName]) return this.services[serviceName]
    else if (!this.availables[serviceName]) throw new Error(`service ${serviceName} not exist`)
    else {
      this.services[serviceName] = new this.availables[serviceName]()
      return this.services[serviceName]
    }
  }
}

const serviceManager = new ServiceManager()
export default serviceManager
