module.exports = {
  // Configure project name:
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Sleep Diary Dashboard';
        return args;
      })
  },
  // Ignore hidden files:
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: [/\/\./],
      },
    },
  },
  transpileDependencies: [
    'vuetify'
  ]
}
