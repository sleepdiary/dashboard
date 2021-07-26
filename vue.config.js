module.exports = {
  // Configure project name:
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Sleep Diary Dashboard';
        args[0].script_url = process.env.VUE_APP_SCRIPT_URL;
        return args;
      });
    config
      .performance
        .maxEntrypointSize(1e6)
        .maxAssetSize(1e6);
    config
      .module
        .rule('worker')
        .test(/worker\.js$/)
        .use('worker-loader')
          .loader('worker-loader')
      .end()
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
