const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devtool = 'source-map';

module.exports = (resourcePath = '') => {
  if (resourcePath.length > 0) {
    resourcePath += '/';
  }

  const entry = {
    'file-hasher-widget': './src/file-hasher-widget/index.js'
  };

  const node = {
    fs: 'empty'
  };

  const resolve = {
    alias: {
      Common: path.resolve(__dirname, 'src/common/'),
      FileHasherWidget: path.resolve(__dirname, 'src/file-hasher-widget/'),
      FileHasherComponents: path.resolve(__dirname, 'src/file-hasher-widget/components'),
      Resources: path.resolve(__dirname, 'src/resources/')
    }
  };

  const modules = {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:base64:5]--[local]'
              }
            },
            { loader: 'sass-loader' }
          ]
        })
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
          options: { presets: [['@babel/env', { targets: { browsers: ['ie 6', 'safari 7'] } }]] }
        }
      }
    ]
  };

  const plugins = [
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath(resourcePath + '[name].css');
      }
    }),

    // Woleet WebLibs need its worker, which requires the crypto lib
    new CopyWebpackPlugin([{
      from: 'node_modules/@woleet/woleet-weblibs/dist/woleet-hashfile-worker.min.js',
      to: resourcePath,
      flatten: true
    }]),
    new CopyWebpackPlugin([{
      from: 'node_modules/@woleet/woleet-weblibs/dist/woleet-crypto.min.js',
      to: resourcePath,
      flatten: true
    }]),

    // PDF.js needs its worker
    new CopyWebpackPlugin([{
      from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
      to: resourcePath,
      flatten: true
    }])
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
