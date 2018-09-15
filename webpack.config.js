const path = require('path');

const MODE = process.env.NODE_ENV || 'production';

module.exports = {
  entry: {
    app: './src/client.ts',
    preload: './src/preload.ts',
    welcome: './src/welcome.ts'
  },
  devtool: 'source-map',
  mode: MODE,
  optimization: {
    minimize: false
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'build')
  }
};
