const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('govuk-frontend');
const root = path.resolve(rootExport, '..');
const sass = path.resolve(root, 'all.scss');
const javascript = path.resolve(root, 'all.js');
const components = path.resolve(root, 'components'); // kept for reference/imports only
const assets = path.resolve(root, 'assets');
const images = path.resolve(assets, 'images');
const fonts = path.resolve(assets, 'fonts');

// ✅ Copy ONLY static assets. Do NOT copy .njk templates or components.
const copyGovukAssets = new CopyWebpackPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
  ],
});

module.exports = {
  // Expose paths so other parts of the build can import govuk sass/js if needed
  paths: { template: root, components, sass, javascript, assets },
  plugins: [copyGovukAssets],
};