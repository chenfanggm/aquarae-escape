// 1) Object.assign
Object.assign = require('object-assign')

// 2) Promise
// ------------------------------------
if (typeof Promise === 'undefined') {
  window.Promise = require('bluebird')
}
