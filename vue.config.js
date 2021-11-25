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
        args[0].title= 'Vue'
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
      builderOptions: {
        win : {
          icon : "public/favicon.ico"
        }
      }
    }
  }
}
