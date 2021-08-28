const path = require('path');

module.exports = (env) => {
  const devMode = env && env.NODE_ENV ? env.NODE_ENV : 'none';

  const entryPoint = {
    index: path.resolve('source/index'),
  };

  const stats = 'minimal';

  const modules = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  };

  const outputPath = devMode === 'production' ? 'dist' : 'examples';

  const output = {
    path: path.resolve(outputPath),
    filename: '[name].js',
  };

  return {
    entry: entryPoint,
    mode: devMode,
    stats: stats,
    module: modules,
    output: output,
  };
};
