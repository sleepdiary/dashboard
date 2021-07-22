module.exports = {
  // Configure project name:
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Sleep Diary Dashboard';
        return args;
      });
    config
      .performance
        .maxEntrypointSize(1e6)
        .maxAssetSize(1e6);
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
  ],
  publicPath: process.env.NODE_ENV === 'production'
  ? '/dashboard/'
  : '/',
}
