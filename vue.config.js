module.exports = {
  publicPath: '/nero/',
  configureWebpack: {
    devServer: {
      public: 'localhost:8080',
      disableHostCheck: true
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      // },
      // proxy: {
      //   '/user': {
      //     target: 'http://localhost:8580/',
      //     changeOrigin: true
      //   }
      // }
    }
  }
}
