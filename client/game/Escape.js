import uuid from 'uuid/v4';
import sceneManager from './managers/sceneManager';
import shaderManager from './managers/shaderManager';
import timeManager from './managers/timeManager';
import { loginUser } from './services/authService';
import Game from './entities/Game';
import MainScene from './scenes/MainScene';
import ShaderProgram from './entities/ShaderProgram';
import Player from './entities/Player';
import simpleDiffuseShader from './shaders/simpleDiffuseShader';
import simpleStandardShader from './shaders/simpleStaticShader';
import bitmapFontShader from './shaders/bitmapFontShader';
import simpleDiffuseSpeculateShader from './shaders/simpleDiffuseSpecularShader';
import cmdManager from "./managers/cmdManager";


class Escape extends Game {
  preload() {
    shaderManager.add([
      new ShaderProgram(simpleStandardShader),
      new ShaderProgram(simpleDiffuseShader),
      new ShaderProgram(simpleDiffuseSpeculateShader),
      new ShaderProgram(bitmapFontShader)
    ]);
    sceneManager.setCurScene(new MainScene());
    return super.preload();
  }

  init() {
    this.player = new Player({
      id: uuid()
    });

    return super.init()
      .then(() => {
        return loginUser(this.player);
      })
      .then(({users, flushedCmds, epoch}) => {
        const scene = sceneManager.getCurScene();
        const newEnqueueCmds = [];
        flushedCmds.forEach((cmdBundle) => {
          if (cmdBundle.data.length > 0) {
            cmdBundle.data.forEach((cmd) => {
              if (cmd.type === 'spawn') return;
              cmd.epoch = cmdBundle.epoch;
              newEnqueueCmds.push(cmd);
            })
          }
        });
        cmdManager.setCmdQueue(newEnqueueCmds);
        const spawnPromises = [];
        users.forEach((user) => {
          if (user.id === this.player.id) {
            spawnPromises.push(scene.spawnPlayer(user));
          } else {
            spawnPromises.push(scene.spawnOtherPlayer(user));
          }
        });
        return Promise.all(spawnPromises)
          .then(() => {
            timeManager.startEpoch();
            timeManager.setCurEpoch(epoch);
          });
      });
  }
}

export default Escape;
