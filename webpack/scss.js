const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const fileNameSuffix = devMode ? '-dev' : '.[contenthash]';
const filename = `[name]${fileNameSuffix}.css`;

module.exports = {
  rules: [
    {
      test: /\.s?css$/,
      use: [
        // Extract CSS to a file (use this in dev & prod for predictable output)
        {
          loader: MiniCssExtractPlugin.loader,
          options: { esModule: false },
        },
        {
          loader: 'css-loader',
          options: {
            url: false,
            sourceMap: devMode,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: devMode,
            sassOptions: { quietDeps: true },
          },
        },
      ],
    },
  ],
  plugins: [
    new MiniCssExtractPlugin({
      filename,
      chunkFilename: '[id].css',
    }),
  ],
};