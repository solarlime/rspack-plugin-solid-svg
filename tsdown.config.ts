import { writeFileSync } from 'node:fs';
import { defineConfig, type UserConfig } from 'tsdown';

const restOptions: Omit<UserConfig, 'entry'> = {
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: false,
  deps: {
    neverBundle: ['svgo', '@rspack/core', 'webpack', '@rsbuild/core'],
  },
};

export default defineConfig([
  {
    entry: 'src/index.ts',
    onSuccess: () => {
      writeFileSync('dist/index.d.ts', "export * from './index.d.mts';\n");
    },
    ...restOptions,
  },
  { entry: 'src/rspack.ts', ...restOptions },
  { entry: 'src/rsbuild.ts', ...restOptions },
  { entry: 'src/loader.ts', ...restOptions },
]);
