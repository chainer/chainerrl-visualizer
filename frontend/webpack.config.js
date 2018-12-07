const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const distDir = path.resolve(path.dirname(__dirname), 'chainerrl_visualizer', 'static', 'dist');
const targets = {
  browsers: ['last 2 versions'],
};

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.jsx',
  ],
  output: {
    path: distDir,
    filename: 'chainerrl_visualizer.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets,
              },
            ],
            '@babel/preset-react',
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|otf|ttf|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([distDir]),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
