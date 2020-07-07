const path = require('path');

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', __dirname + '/src')
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('global', __dirname + '/src/global')
  }
}
