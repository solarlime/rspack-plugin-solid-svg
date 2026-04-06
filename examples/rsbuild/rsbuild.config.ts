import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  source: {
    entry: {
      index: './src/App.tsx',
    },
  },
  server: {
    open: false,
    port: 3003,
  },
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions: {
        presets: ['solid'],
      },
    }),
    pluginSolid(),
    rsbuildPluginSolidSvg({
      svgo: { enabled: false },
    }),
  ],
});
