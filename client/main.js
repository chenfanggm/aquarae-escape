import './main.scss'
import './normalize'
import './commons/libs/gl-matrix'
import config from '../config'
import Detector from './commons/libs/Detector'
import Escape from './games/Escape'


// global debug flag
window.__DEBUG__ = true

if (Detector.webgl) {
  // global gl ref object
  const canvas = document.getElementById('mainCanvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const gl = canvas.getContext('webgl')
  window.aquarae = { canvas, gl }
  // create game
  const game = new Escape()
  game.start()

  // HMR
  if (config.env === 'development' && module.hot) {
    module.hot.accept('./main', () => {
      game && game.reload && game.reload()
    })
  }
  // resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    game && game.reload && game.reload()
  })


} else {
  const warning = Detector.getWebGLErrorMessage()
  document.getElementById('mainCanvas').appendChild(warning)
}
