const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { version } = require('./package.json');

// 배포용 설정
module.exports = merge(common, {
  mode: 'production',
  output: {
    path: `/Users/leesukkyu/git/ele/web/server/public`,
    filename: `[name].${version}.js`,
  },
});
