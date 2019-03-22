const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devtool = 'source-map';

module.exports = (resourcePath = '') => {
  if (resourcePath.length > 0) {
    resourcePath += '/';
  }

  const entry = {
    'file-hasher-widget': './src/file-hasher-widget/index.js',
    'proof-verifier-widget': './src/proof-verifier-widget/index.js'
  };

  const node = {
    fs: 'empty'
  };

  const resolve = {
    alias: {
      Common: path.resolve(__dirname, 'src/common/'),
      FileHasherWidget: path.resolve(__dirname, 'src/file-hasher-widget/'),
      FileHasherComponents: path.resolve(__dirname, 'src/file-hasher-widget/components'),
      Resources: path.resolve(__dirname, 'src/resources/'),
      ProofVerifierWidget: path.resolve(__dirname, 'src/proof-verifier-widget/'),
      ProofVerifierComponents: path.resolve(__dirname, 'src/proof-verifier-widget/components')
    }
  };

  const modules = {
    rules: [
      { test: /\.hbs/, loader: 'handlebars-loader' },
      { test: /locales/, loader: '@alienfast/i18next-loader' },
      {
        test: /\.(css|scss)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { modules: true, localIdentName: '[hash:base64:5]--[local]' } },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.js$/i,
        exclude: [/node_modules/, /dist/],
        use: { loader: 'babel-loader', options: { presets: [['@babel/env', { targets: { browsers: ['ie 6', 'safari 7'] } }]] } }
      }
    ]
  };

  const plugins = [
    new ExtractTextPlugin({ filename: (getPath) => { return getPath(resourcePath + '[name].css'); } }),
    new CopyWebpackPlugin([{ from: 'node_modules/@woleet/woleet-weblibs/dist/*.min.js', to: resourcePath, flatten: true }]),
    new CopyWebpackPlugin([{ from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js', to: resourcePath, flatten: true }]),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    })
  ];

  return {
    devtool,
    node,
    entry,
    resolve,
    module: modules,
    plugins
  };
};
