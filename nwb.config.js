const path = require('path')

module.exports = {
  type: 'preact-app',
  webpack: {
    aliases: {
      src: path.resolve('src'),
    },
  },
}
