const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
    library: {
      type: 'module',
    },
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: true,
      outputHashing: 'contenthash',
      generatePackageJson: false,
      sourceMaps: true,
      vendorChunk: true,
      namedChunks: true,
      externalDependencies: 'none',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 200000,
      automaticNameDelimiter: '.',
      cacheGroups: {
        // Split vendors into individual chunks if they're big enough
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packagePath = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );
            if (!packagePath) return 'vendor.misc';
            const packageName = packagePath[1].replace('@', '');
            return `vendor.${packageName}`;
          },
          chunks: 'all',
          reuseExistingChunk: true,
          enforce: true,
        },
        // Group tiny vendors together
        misc: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor.misc',
          chunks: 'all',
          priority: -10,
          reuseExistingChunk: true,
          enforce: false,
        },
      },
    },
  },
};
