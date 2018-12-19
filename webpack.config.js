const fs = require('fs');
const path = require('path');

const lambdaDir = path.join(__dirname, 'src', 'functions');
const allEntries = fs.readdirSync(lambdaDir)
    .reduce((entryObj, functionName) => {
        entryObj[functionName] = `.${path.sep}${path.join('src', 'functions', functionName, 'framework', 'handler.ts')}`
        return entryObj;
    }, {});

module.exports = env => ({
  target: 'node',
  mode: 'production',
  entry: env && env.lambdas ?
    env.lambdas.split(',').reduce((entryObj, fnName) => ({ ...entryObj, [fnName]: allEntries[fnName] }), {}) : allEntries,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js', '.jsx', '.json' ]
  },
  output: {
    filename: `[name].js`,
    path: path.join(__dirname, 'build', 'bundle'),
    libraryTarget: 'commonjs'
  },
});
