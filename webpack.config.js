const path                        = require('path');
const webpack                     = require('webpack');
const CopyWebpackPlugin           = require('copy-webpack-plugin');
const ExtractTextPlugin           = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin     = require('optimize-css-assets-webpack-plugin');

const bundleOutputDir             = './dist';

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);
  const publicPath = isDevBuild ? '/' : '../dist/';
  console.log('env', env, isDevBuild);
  return [{
    entry: './src/index.js',
    mode: isDevBuild ? 'development' : 'production',
    output: {
      filename: 'woleet-widget.js',
      chunkFilename: '[name].js',
      path: path.resolve(bundleOutputDir),
      publicPath : publicPath
    },
    devServer: {
      contentBase: bundleOutputDir
    },
    module: {
      rules: [
        { test: /\.html$/i, use: 'html-loader' },
        { test: /\.(css|scss)$/i, use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                /*options: {
                  modules: true,
                  localIdentName: '[hash:base64:5]--[local]'
                }*/
              },
              {
                loader: 'sass-loader'
              }
            ]
          })
        },
        {
          test: /\.js$/i, exclude: /node_modules/, use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/env', {
                'targets': {
                  'browsers': ['ie 6', 'safari 7']
                }
              }]]
            }
          }
        }
      ]
    },
    optimization: {
      minimize: !isDevBuild
    },
    plugins: isDevBuild ?
      [
        new webpack.SourceMapDevToolPlugin(),
        new CopyWebpackPlugin([{ from: 'demo/' }]),
        new ExtractTextPlugin({
          filename:  (getPath) => {
            return getPath('[name].css');
          },
          allChunks: true
        })
      ] : [
        new ExtractTextPlugin({filename:  (getPath) => {return getPath('[name].css');}, allChunks: true}),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        })
      ]
  }];
};
