// webpack.config.js
const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/assets/js');
const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const scss = require(path.resolve(__dirname, 'webpack/scss'));
const htmlWebpack = require(path.resolve(__dirname, 'webpack/htmlWebpack'));

const devMode = process.env.NODE_ENV !== 'production';
const fileNameSuffix = devMode ? '-dev' : '.[contenthash]';
const filename = `[name]${fileNameSuffix}.js`;

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(sourcePath, 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    publicPath: '',
    filename,
    clean: true,
  },
  devtool: devMode ? 'source-map' : false,
  module: {
    rules: [
      ...scss.rules,
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    ...govukFrontend.plugins, // copies ONLY assets (fonts/images) – no templates
    ...scss.plugins,          // extracts CSS
    ...htmlWebpack.plugins,   // currently a no-op (kept for parity with your imports)
  ],
  stats: {
    assets: true,
    errors: true,
    warnings: true,
    errorDetails: true,
  },
};