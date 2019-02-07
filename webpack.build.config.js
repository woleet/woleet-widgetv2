'use strict';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const resourcePath = 'dist';
const config = require('./webpack.config')(resourcePath);

config.mode = 'production';

config.output = {
  filename: resourcePath + '/woleet-widget.js',
  chunkFilename: resourcePath + '/[name].js',
  path: path.resolve(__dirname),
  publicPath: '/'
};

/**
 * Add production plugins
 */
config.plugins.push(new CleanWebpackPlugin([
  path.resolve(__dirname, resourcePath)
]));

config.plugins.push(new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: require('cssnano'),
  cssProcessorPluginOptions: {
    preset: ['default', { discardComments: { removeAll: true } }]
  },
  canPrint: true
}));

module.exports = config;
