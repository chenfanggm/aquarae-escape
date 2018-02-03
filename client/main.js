import './main.scss';
import './normalize';
import './game/libs/gl-matrix';
import config from '../config';
import Detector from './game/libs/Detector';
import Escape from './game';
import utils from './game/entities/utils';


// global debug flag
window.__DEBUG__ = true;

if (Detector.webgl) {
  // setup env
  const canvas = document.getElementById('mainCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  // start game
  const gameConfig = { gl, canvas };
  window.aquarae = window.aquarae && { ...window.aquarae, ...gameConfig } || gameConfig;
  const game = new Escape(gameConfig);
  game.start();

  // HMR
  if (config.env === 'development' && module.hot) {
    module.hot.accept('./main', () => {
      game && game.reload && game.reload();
    });
  }
} else {
  const warning = Detector.getWebGLErrorMessage();
  document.getElementById('mainCanvas').appendChild(warning);
}
