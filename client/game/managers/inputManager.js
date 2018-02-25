import KeyCode from 'keycode-js';
import gameManager from './gameManager';
import timeManager from './timeManager';

class InputManager {
  constructor() {
    this.keyMap = {};
    this.axis = {
      Horizontal: 0,
      Vertical: 0,
      ViceHorizontal: 0,
      ViceVertical: 0
    };
    this.mouse = {
      position: { x: 0, y: 0 }
    };
    this.setKeyDown = this.setKeyDown.bind(this);
    this.setKeyUp = this.setKeyUp.bind(this);

    this.mouseClickListeners = [];
  }

  init() {
    this.game = gameManager.getGame();
    window.addEventListener('keyup', (event) => {
      this.setKeyUp(event.keyCode);
    });

    window.addEventListener('keydown', (event) => {
      this.setKeyDown(event.keyCode);
    });

    const canvas = this.game.canvas;
    canvas.addEventListener('mousemove',(event) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setMousePosition(mouseX, mouseY);
    });

    canvas.addEventListener('click',(event) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.mouseClickListeners.forEach((listener) => {
        if (mouseX > listener.owner.position[0] && mouseX < listener.owner.position[0] + listener.owner.width
        && mouseY > listener.owner.position[1] && mouseY < listener.owner.position[1] + listener.owner.height) {
          listener.callback && listener.callback(event);
        }
      });
    });
  }

  on(obj, eventName, callback) {
    switch (eventName) {
      case 'click':
        this.mouseClickListeners.push({ owner: obj, callback });
        break;
    }
  }

  onChange() {
    this.updateAxis();
  }

  setKeyDown(keyCode) {
    this.keyMap[keyCode] = true;
    this.onChange();
  }

  setKeyUp(keyCode) {
    this.keyMap[keyCode] = false;
    this.onChange();
  }

  getKey(keyCode) {
    return this.keyMap[keyCode] || false;
  }

  getAxis(axisName) {
    return this.axis[axisName];
  }

  updateAxis() {
    // horizontal
    if (this.keyMap[KeyCode.KEY_A] || this.keyMap[KeyCode.KEY_LEFT]) {
      this.axis.Horizontal = -1;
    } else if (this.keyMap[KeyCode.KEY_D] || this.keyMap[KeyCode.KEY_RIGHT]) {
      this.axis.Horizontal = 1;
    } else {
      this.axis.Horizontal = 0;
    }
    // vertical
    if (this.keyMap[KeyCode.KEY_W] || this.keyMap[KeyCode.KEY_UP]) {
      this.axis.Vertical = 1;
    } else if (this.keyMap[KeyCode.KEY_S] || this.keyMap[KeyCode.KEY_DOWN]) {
      this.axis.Vertical = -1;
    } else {
      this.axis.Vertical = 0;
    }
    // vice horizontal
    if (this.keyMap[KeyCode.KEY_J]) {
      this.axis.ViceHorizontal = -1;
    } else if (this.keyMap[KeyCode.KEY_L]) {
      this.axis.ViceHorizontal = 1;
    } else {
      this.axis.ViceHorizontal = 0;
    }
    // vice vertical
    if (this.keyMap[KeyCode.KEY_I]) {
      this.axis.ViceVertical = 1;
    } else if (this.keyMap[KeyCode.KEY_K]) {
      this.axis.ViceVertical = -1;
    } else {
      this.axis.ViceVertical = 0;
    }
  }

  setMousePosition(x, y) {
    this.mouse.position.x = x;
    this.mouse.position.y = y;
  }
}

export default new InputManager();