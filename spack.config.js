const { config } = require('@swc/core/spack');

module.exports = config({
  entry: {
    'worker.dist': __dirname + '/dist/worker.js',
  },
  output: {
    path: __dirname + '/dist',
  },
});
