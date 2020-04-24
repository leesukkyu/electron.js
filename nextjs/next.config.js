const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const withTM = require('next-transpile-modules')(['next-session']);

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {};
}

module.exports = withTM(
  withLess(
    withSass(
      withCSS({
        lessLoaderOptions: {
          javascriptEnabled: true,
        },
        transpileModules: ['next-session'],
      }),
    ),
  ),
);
