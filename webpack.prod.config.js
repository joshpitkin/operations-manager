const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/index.html',
  filename: 'index.html',
  inject: 'body'
})
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css'
})

module.exports = { /* global module */
  context: __dirname,
  entry: [
    './app/src/main/index.js'
  ],
  output: {
      filename: '[name].js?[chunkhash]',
      path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.html$/, loaders: ['html-loader'] },
      {test: /\.(scss|css)$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }]
      },
      {test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          outputPath: 'assets/',
          publicPath: 'http://localhost:8080/',
          emitFile: true
        }
        // ?name=[name].[ext]&publicPath=http://localhost:8080/dist/fonts/&outputPath=fonts/'
      }
    ]
  },
  plugins: [ extractSass,
    new webpack.optimize.CommonsChunkPlugin({
       name: 'vendor',
       minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1
       }
    }),
    //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
       name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),
    HtmlWebpackPluginConfig,
    new webpack.optimize.UglifyJsPlugin({ // prod only
      sourceMap: false,
      mangle: false
    })
   ]
}
