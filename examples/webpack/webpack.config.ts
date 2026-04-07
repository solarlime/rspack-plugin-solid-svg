const HtmlWebpackPlugin = require('html-webpack-plugin');
const { RspackPluginSolidSvg } = require('rspack-plugin-solid-svg/rspack');

// const { RspackPluginSolidSvg } = require('rspack-plugin-solid-svg'); // another way

module.exports = {
  entry: {
    main: './src/App.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/',
    clean: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(tsx|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['solid'],
              plugins: ['solid-refresh/babel'],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        resourceQuery: /\?solid/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['solid'],
            },
          },
          RspackPluginSolidSvg.loader,
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.svg$/,
        resourceQuery: { not: [/\?solid/] },
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    port: 3001,
    hot: true,
    open: false,
  },
};
