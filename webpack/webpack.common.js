/** @type import('webpack').Configuration */
module.exports = {
  entry: {
    background: './src/ts/background.ts',
    'content-script': './src/ts/contentScript.tsx',
  },
  output: {
    path: `${process.cwd()}/public/js`,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-nested'],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: (chunk) => chunk.name !== 'background',
    },
  },
  experiments: {
    topLevelAwait: true,
  },
};
