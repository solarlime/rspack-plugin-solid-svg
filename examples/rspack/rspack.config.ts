import { defineConfig } from '@rspack/cli';
import { type RspackOptions, rspack } from '@rspack/core';
import PluginSvgSolid from '@svg-solid-plugin/rspack';

const config: RspackOptions = defineConfig({
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
    ],
  },
  plugins: [
    new PluginSvgSolid({
      svgo: {
        enabled: true,
        svgoConfig: {
          plugins: [
            'removeXMLProcInst',
            'removeMetadata',
            'removeDoctype',
            {
              name: 'cleanupIds',
              params: {
                preserve: ['helpful'],
              },
            },
          ],
        },
      },
    }),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    port: 3002,
    hot: true,
    open: false,
  },
});

export default config;
