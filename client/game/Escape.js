import uuid from 'uuid/v4';
import sceneManager from './managers/sceneManager';
import shaderManager from './managers/shaderManager';
import Game from './entities/Game';
import MainScene from './scenes/MainScene';
import ShaderProgram from './entities/ShaderProgram';
import Player from './entities/Player';
import simpleDiffuseShader from './shaders/simpleDiffuseShader';
import simpleStandardShader from './shaders/simpleStandardShader';
import bitmapFontShader from './shaders/bitmapFontShader';
import { loginUser } from './services/authService';


class Escape extends Game {

  init() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.bgColor = 0xC2C3C4;
    // scene
    sceneManager.setCurScene(new MainScene('mainScene'));
    // shader
    shaderManager.register([
      new ShaderProgram(simpleStandardShader),
      new ShaderProgram(simpleDiffuseShader),
      new ShaderProgram(bitmapFontShader)
    ]);
    // player
    this.player = new Player({
      id: uuid()
    });

    super.init()
      .then(() => {
        return loginUser(this.player);
      })
      .then((users) => {
        const scene = sceneManager.getCurScene();
        users.forEach((user) => {
          if (user.id === this.player.id) {
            scene.spawnPlayer(user);
          } else {
            scene.spawnOtherPlayer(user);
          }
        });
      })
      .then(() => {
        this.loop();
      });
  }
}

export default Escape;
