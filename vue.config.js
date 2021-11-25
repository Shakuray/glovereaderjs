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
      enableRemoteModule: true,
      nodeIntegration: true,
      builderOptions: {
        win : {
          title : "GloveReaderJS",
          icon : "public/favicon.ico"
        }
      }
    }
  }
}
