import Plane from '../../objects/Plane';
import Susan from '../../objects/Susan';


export default {
  objects: [{
    clazz: Plane,
    options: {
      width: 20,
      height: 20
    }
  }, {
    clazz: Susan,
    options: {
      transform: { position: [0, 1, 0] }
    }
  }]
};