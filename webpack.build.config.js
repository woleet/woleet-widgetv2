const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

const resourcePath = 'dist';
const config = require('./webpack.config')('.', true);

config.mode = 'production';

config.output = {
  filename: './[name].js',
  chunkFilename: './[name].js',
  path: path.resolve(__dirname, resourcePath),
  publicPath: '../',
  clean: true
};

config.plugins.push(new CssMinimizerPlugin());

module.exports = config;
