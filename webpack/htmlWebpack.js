const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const cssTemplate = path.resolve(__dirname, '../src/main/views/webpack/css-template.njk');
const jsTemplate = path.resolve(__dirname, '../src/main/views/webpack/js-template.njk');

// These generate files directly into your views folder so Nunjucks can include them.
const cssWebPackPlugin = new HtmlWebpackPlugin({
  template: cssTemplate,
  filename: cssTemplate.replace('-template', ''), // -> css.njk
  inject: false,
  minify: false,
});

const jsWebPackPlugin = new HtmlWebpackPlugin({
  template: jsTemplate,
  filename: jsTemplate.replace('-template', ''), // -> js.njk
  inject: false,
  minify: false,
});

module.exports = {
  plugins: [cssWebPackPlugin, jsWebPackPlugin],
};