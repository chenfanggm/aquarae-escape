import './main.scss'
import './normalize'
import './commons/libs/gl-matrix'
import config from '../config'
import Detector from './commons/libs/Detector'
import Escape from './games/Escape'
import utils from './commons/utils'


// global debug flag
window.__DEBUG__ = true

if (Detector.webgl) {
  // setup env
  const canvas = document.getElementById('mainCanvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  // start game
  const gameConfig = { gl, canvas, frameRate: 60 }
  window.aquarae = gameConfig
  const game = new Escape(gameConfig)
  game.start()

  // HMR
  if (config.env === 'development' && module.hot) {
    module.hot.accept('./main', () => {
      game && game.reload && game.reload()
    })
  }
  // resize
  window.addEventListener('resize', utils.debounce(() => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    game && game.reload && game.reload()
  }, 100))
} else {
  const warning = Detector.getWebGLErrorMessage()
  document.getElementById('mainCanvas').appendChild(warning)
}

