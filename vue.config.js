const crypto = require('crypto')
const origCreateHash = crypto.createHash
crypto.createHash = (algorithm) => origCreateHash(algorithm === 'md4' ? 'sha256' : algorithm)

module.exports = {
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
    },
    electronBuilder: {
      enableRemoteModule: true,
      nodeIntegration: true,
      builderOptions: {
        win : {
          icon : "public/favicon.ico"
        }
      }
    }
  }
}
