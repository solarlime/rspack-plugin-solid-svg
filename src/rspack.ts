import { join } from 'node:path';
import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Config as SvgoOptions } from 'svgo';
import type { Compiler as WebpackCompiler } from 'webpack';

export type Compiler = RspackCompiler | WebpackCompiler;

export type LoaderOptions = {
  svgo?: {
    enabled?: boolean;
    svgoConfig?: SvgoOptions;
  };
};

export const loaderPath = join(import.meta.dirname, 'loader.mjs');

export class RspackPluginSolidSvg {
  name = 'rspack-plugin-solid-svg';
  static loader = loaderPath;

  constructor(private options: LoaderOptions = {}) {}

  apply(compiler: Compiler) {
    const { svgo = { enabled: true } } = this.options;

    if (!compiler.options.module) {
      compiler.options.module = {
        rules: [],
        parser: {},
        generator: {},
      };
    }
    if (!compiler.options.module.rules) compiler.options.module.rules = [];

    compiler.options.module.rules.push({
      oneOf: [
        // Rule for SVG files with ?solid query (as JSX components)
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
            {
              loader: loaderPath,
              options: { svgo },
            },
          ],
          type: 'javascript/auto',
        },
        // Rule for regular SVG files (as URLs)
        {
          test: /\.svg$/,
          resourceQuery: { not: [/\?solid/] },
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash][ext]',
          },
        },
      ],
    });
  }
}
