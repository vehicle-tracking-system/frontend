module.exports = {
  devServer: {
    // proxy: 'http://localhost:8080',
    compress: true,
    disableHostCheck: true // That solved it
  }
}
