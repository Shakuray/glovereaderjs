const crypto = require('crypto')
const origCreateHash = crypto.createHash
crypto.createHash = (algorithm) => origCreateHash(algorithm === 'md4' ? 'sha256' : algorithm)

module.exports = {
  // Relative paths so the build works from any folder, e.g. a GitHub Pages project site
  publicPath: './',

  "transpileDependencies": [
    "vuetify"
  ],

  configureWebpack: {
    devtool: 'source-map',
  },

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'GloveReader'
        return args
      })
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
