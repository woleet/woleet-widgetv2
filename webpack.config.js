const path = require('path');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const devtool = 'source-map';

module.exports = (resourcePath = '.', prod = false) => {
  if (resourcePath.length > 0) {
    resourcePath += '/';
  }

  const entry = {
    'file-hasher-widget': './src/file-hasher-widget/index.js',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
  };

  const resolve = {
    alias: {
      Common: path.resolve(__dirname, 'src/common/'),
      FileHasherWidget: path.resolve(__dirname, 'src/file-hasher-widget/'),
      FileHasherComponents: path.resolve(__dirname, 'src/file-hasher-widget/components'),
      Resources: path.resolve(__dirname, 'src/resources/')
    },
    fallback: {
      'fs': false,
      'buffer': require.resolve('buffer'),
      'stream': require.resolve('stream-browserify')
    }
  };

  const modules = {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: [prod ? ExtractTextPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64:5]--[local]'
              }
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      },
      {
        test: /\.js$/i,
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
      }
    ]
  };

  const plugins = [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new ExtractTextPlugin({
      filename: resourcePath + '[name].css'
    }),

    // Woleet WebLibs need its worker, which requires the crypto lib
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/@woleet/woleet-weblibs/dist/woleet-hashfile-worker.min.js',
        to: resourcePath
      },
      {
        from: 'node_modules/@woleet/woleet-weblibs/dist/woleet-crypto.min.js',
        to: resourcePath
      },
      // PDF.js needs its worker
      {
        from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
        to: resourcePath
      }]
    })
  ];

  return {
    devtool,
    entry,
    resolve,
    module: modules,
    plugins
  };
};
