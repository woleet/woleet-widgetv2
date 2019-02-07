'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const resourcePath = '';
const config = require('./webpack.config')(resourcePath);
const port = 9000;

config.devtool = 'inline-source-map';
config.mode = 'development';
config.optimization = { minimize: true };

config.output = {
  filename: '[name].js',
  chunkFilename: '[name].js',
  path: path.resolve(__dirname),
  publicPath: '/' // Uses webpack-dev-server in development
};

config.devServer = {
  compress: true,
  port: port,
  open: false,
  disableHostCheck: true,
  historyApiFallback: true,
  stats: {
    modules: false,
    cached: false,
    colors: true,
    chunk: false
  }
};
/**
 * Add development plugins
 */
config.plugins.push(new HtmlWebpackPlugin({
  filename: resourcePath + 'index.html',
  template: 'examples/webpack-dev.html',
  inject: false
}));

module.exports = config;
