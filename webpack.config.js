var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/app.js'
  ],
  output: {
    path: 'dist',
    filename: 'app.build.js',
    library : true,
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals : [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
