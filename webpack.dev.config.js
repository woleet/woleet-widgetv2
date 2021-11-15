const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const resourcePath = '';
const config = require('./webpack.config')(resourcePath, false);

const port = 9000;

config.devtool = 'inline-source-map';
config.mode = 'development';

config.output = {
  filename: '[name].js',
  chunkFilename: '[name].js',
  path: path.resolve(__dirname),
  publicPath: '/' // Uses webpack-dev-server in development
};

config.devServer = {
  static: {
    directory: path.join(__dirname)
  },
  port: port,
  open: false,
  historyApiFallback: true
};

/**
 * Add development plugins
 */
config.plugins.push(new HtmlWebpackPlugin({
  filename: resourcePath + 'index.html',
  template: 'examples/dev-hasher.html',
  inject: false
}));

module.exports = config;
