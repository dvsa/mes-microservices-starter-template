const fs = require('fs');
const path = require('path');

const lambdaDir = path.join(__dirname, 'src', 'functions');
const entries = fs.readdirSync(lambdaDir)
    .reduce((entryObj, functionName) => {
        entryObj[functionName] = `.${path.sep}${path.join('src', 'functions', functionName, 'index.ts')}`
        return entryObj;
    }, {});

module.exports = {
  target: 'node',
  mode: 'production',
  entry: entries,
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
};
