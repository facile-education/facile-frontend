module.exports = {
  publicPath: '/nero/',
  configureWebpack: {
    devServer: {
      // https: true,
      // public: '127.0.0.1:8080',
      public: 'localhost:8080',
      disableHostCheck: true
    },
    performance: {
      // Only enable performance hints for production builds,
      // outside of tests.
      hints:
        process.env.NODE_ENV === 'production' &&
        !process.env.VUE_APP_TEST &&
        'warning'
    },
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  chainWebpack: config => {
    config.plugins.delete('pwa')
    config.plugins.delete('workbox')
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader')
      .end()
      // {
      //   resourceQuery: /blockType=i18n/,
      //   type: 'javascript/auto',
      //   loader: '@intlify/vue-i18n-loader'
      // }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'fr',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
