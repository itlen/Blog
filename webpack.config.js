const path = require('path');
module.exports = {
  entry: { main: './project/src/js/main.js' },
  output: {
    path: path.resolve(__dirname, './project/build/js/'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}