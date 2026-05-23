import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg/rsbuild';

// import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg'; // another way

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  source: {
    entry: {
      index: './src/App.tsx',
    },
  },
  html: {
    title: 'Solid SVG Plugin Test',
  },
  server: {
    open: false,
    port: 3005,
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
