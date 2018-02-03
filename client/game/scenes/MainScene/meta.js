import Plane from '../../objects/Plane';
import Susan from '../../objects/Susan';
import Text from '../../guis/Text';


export default {
  objects: [{
    clazz: Plane,
    opts: {
      width: 20,
      height: 20
    }
  }, {
    clazz: Susan,
    opts: {
      transform: { position: [0, 1, 0] }
    }
  }],
  guis: [{
    clazz: Text,
    opts: {
      message: 'Hello World',
      position: [320, 160]
    }
  }]
};