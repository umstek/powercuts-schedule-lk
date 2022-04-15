const { config } = require('@swc/core/spack');

module.exports = config({
  entry: {
    web: __dirname + '/dist/worker.js',
  },
  output: {
    path: __dirname + '/dist',
  },
});
