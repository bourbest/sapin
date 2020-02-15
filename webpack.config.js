const webpack = require('webpack')
const pkg = require('./package.json')

const buildConfig = (env) => {
  let libraryName = pkg.name
  let plugins = [], outputFile

  plugins.push( new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }))


  outputFile = libraryName + '.min.js'

  return config = {
    mode: 'production',
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
      path: __dirname + '/lib',
      filename: outputFile,
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    performance: {
      hints: 'warning'
    },
    optimization: {
      minimize: true
    },
    externals: {
       lodash: {
         commonjs: 'lodash',
         commonjs2: 'lodash',
         amd: 'lodash',
         root: '_'
       },
       "date-fns": {
         commonjs: 'date-fns',
         commonjs2: 'date-fns',
         amd: 'date-fns',
         root: 'datefns'
       }
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: ['env']
          }
        }
      }]
    },
    plugins: plugins
  }
}

module.exports = buildConfig
