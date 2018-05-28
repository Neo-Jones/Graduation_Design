require('babel-core/register')({
  // presets: ['es2015', 'stage-0']
  presets: [
    ['env', {
      modules: false,
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
      }
    }],
    'stage-2',
  ],
  plugins: ['transform-vue-jsx', 'transform-runtime'],
})
require('babel-polyfill')

module.exports = require('./index.js')
