const webpack = require('webpack');
const path = require('path');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
  entry: {
    background: path.join(srcDir, 'background.ts'),
    mount: path.join(srcDir, 'mount.tsx'),
  },
  output: {
    publicPath: '',
    path: path.join(__dirname, '../public/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      },
    },
  },
};
