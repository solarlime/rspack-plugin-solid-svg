import assert from 'node:assert';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { before, describe, test } from 'node:test';
import { execa } from 'execa';

const beforeFunction = async (example) => {
  const cwd = resolve(`examples/${example}`);
  await rm(`${cwd}/dist`, { recursive: true, force: true });
  await execa('pnpm', ['run', 'build'], { cwd });
  return cwd;
};

const examples = ['rspack-v1', 'rspack-v2', 'webpack', 'rsbuild-v1', 'rsbuild-v2'];

for (const example of examples) {
  describe(`${example} integration tests`, () => {
    let cwd: string;

    before(async () => {
      cwd = await beforeFunction(example);
    });

    test('should insert SVG in the bundle', async () => {
      assert.ok(existsSync(`${cwd}/dist/index.bundle.js`));

      const code = readFileSync(`${cwd}/dist/index.bundle.js`, 'utf8');
      assert.match(code, /<svg/i);
      assert.match(code, /<circle/i);
    });

    test('should deal with another SVG files', async () => {
      assert.ok(existsSync(`${cwd}/dist/index.bundle.js`));
      const code = readFileSync(`${cwd}/dist/index.bundle.js`, 'utf8');

      const files = readdirSync(`${cwd}/dist`, { recursive: true });
      const svgName = files.find((file) => file.endsWith('.svg'));

      // asset/resource
      const resolutionWayOne = new RegExp(svgName, 'i').test(code);
      // asset/inline
      const resolutionWayTwo = /data:image\/svg+xml;base64/i.test(code);
      assert.ok(resolutionWayOne || resolutionWayTwo);
    });
  });
}
