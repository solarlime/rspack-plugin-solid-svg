import type { RsbuildPlugin, RsbuildPluginAPI } from '@rsbuild/core';
import { createSvgSolidRules, type LoaderOptions } from './core.ts';

export function rsbuildPluginSolidSvg(options: LoaderOptions = {}): RsbuildPlugin {
  return {
    name: 'rsbuild-plugin-solid-svg',

    setup(api: RsbuildPluginAPI) {
      api.modifyRspackConfig((config) => {
        const pluginRules = createSvgSolidRules(options);

        config.module ??= {};
        config.module.rules ??= [];

        // Rsbuild has its rules which we need to modify
        for (const rule of config.module.rules) {
          if (
            typeof rule === 'object' &&
            rule &&
            'test' in rule &&
            rule.test instanceof RegExp &&
            rule.test.test('.svg')
          ) {
            Object.assign(rule, {
              test: /\.svg$/,
              oneOf: [
                // Rule for SVG files with ?solid query (as JSX components)
                pluginRules.solid,
                // Other SVG rules defined by Rsbuild
                ...(rule.oneOf ?? []),
              ],
            });

            return;
          }
        }
      });
    },
  };
}
