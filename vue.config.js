module.exports = {
  devServer: {
    proxy: 'http://localhost:8080',
    compress: true,
    disableHostCheck: true // That solved it
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Vehicle tracking system'
        return args
      })
  }
}
