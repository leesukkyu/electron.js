const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {};
}

module.exports = withLess(
  withSass(
    withCSS({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    }),
  ),
);
