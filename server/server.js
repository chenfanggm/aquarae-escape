import path from 'path'
import config from '../config'
import webpack from 'webpack'
import webpackConfig from '../config/webpack.config'
import http from 'http'
import url from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import WebSocket from 'ws'
import httpStatus from 'http-status'
import APIHandler from './controllers/APIHandler'
import errorHandler from './middleware/errorHandler'
import APIError from './APIError'
import _debug from 'debug'
import arenaService from './services/arenaService'


const debug = _debug('app:server')

debug('Init express app...')
const app = express()
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------

if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  debug('Enabling webpack development and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : path.resolve(config.baseDir, config.clientDir),
    hot         : true,
    quiet       : false,
    noInfo      : false,
    lazy        : false,
    stats       : 'normal',
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  app.use(express.static(path.resolve(config.baseDir, config.staticDir)))

  // fallback all routes to index.html
  app.use('/', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })

  debug('Server is running on DEVELOPMENT mode.')
} else {
  app.use(express.static(path.resolve(config.baseDir, config.distDir), {
    maxage: config.cache_control.max_age
  }))
  debug('Server is running on PRODUCTION mode.')
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// error transform
app.use(function (err, req, res, next) {
  if (Array.isArray(err)) {
    const unifiedErrorMessage = err.map(function (error) { return error.msg }).join(' and ')
    const error = new APIError(unifiedErrorMessage, httpStatus.BAD_REQUEST, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    return next(new APIError(err.message, err.status, err.isPublic))
  }
  return next(err)
})

// error handler
app.use(errorHandler())

// WSS
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const apiHandler = new APIHandler()
wss.on('connection', (ws, req) => {
  const location = url.parse(req.url, true)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  debug(`a client is connected from: ${ip}`)

  ws.isAlive = true
  ws.on('message', (message) => {
    let msgMeta = null
    try {
      msgMeta = JSON.parse(message)
    } catch (err) {
      console.log(message)
    }

    switch (msgMeta.type) {
      case 'cmd':
        arenaService.enqueueCmd(msgMeta.data)
        break
      case 'api':
        apiHandler.handle(ws, msgMeta)
        break
      default:
        break
    }
  })

  ws.on('error', (err) => {
    debug('received error: ', err)
  })

  ws.on('close', () => {
    debug('a ws is closed')
  })
})

module.exports = server
