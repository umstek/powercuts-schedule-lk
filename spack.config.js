const { config } = require('@swc/core/spack');

module.exports = config({
  entry: {
    worker: __dirname + '/src/worker.ts',
  },
  output: {
    path: __dirname + '/dist',
  },
});
