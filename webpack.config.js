const ExtractTextPlugin = require('extract-text-webpack-plugin');
const devtool = 'source-map';

module.exports = (resourcePath = '') => {
  if (resourcePath.length > 0) {
    resourcePath += '/';
  }

  const entry = './src/index.js';
  const modules = {
    rules: [
      { test: /\.html$/i, use: 'html-loader' },
      {
        test: /\.(css|scss)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
              /* options: {
                  modules: true,
                  localIdentName: '[hash:base64:5]--[local]'
                } */
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.js$/i,
        exclude: [
          /node_modules/,
          /dist/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', {
              targets: {
                browsers: ['ie 6', 'safari 7']
              }
            }]]
          }
        }
      }
    ]
  };
  const plugins = [
    new ExtractTextPlugin({ filename: (getPath) => { return getPath(resourcePath + '[name].css'); }})
  ];

  return {
    devtool,
    entry,
    module: modules,
    plugins
  };
};
