import Plane from '../../objects/Plane';
import Susan from '../../objects/Susan';
import Text from '../../guis/Text';
import CubeModel from '../../models/CubeModel';
import PlaneModel from '../../models/PlaneModel';
import SusanModel from '../../models/SusanModel';
import TreeModel from '../../models/TreeModel';


export default {
  objects: [{
    clazz: Plane,
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
  }],
  models: [{
    name: 'cube',
    clazz: CubeModel
  }, {
    name: 'plane',
    clazz: PlaneModel,
    opts: {
      width: 20,
      height: 20,
      widthSegments: 1,
      heightSegments: 1
    }
  }, {
    name: 'susan',
    clazz: SusanModel
  }, {
    name: 'tree',
    clazz: TreeModel
  }]
};