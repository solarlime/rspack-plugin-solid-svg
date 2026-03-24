import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { Config } from 'svgo';
import { compileSvg, optimizeSvg } from '../src/utils.ts';

describe('Utils', () => {
  describe('compileSvg', () => {
    test('should convert simple SVG to JSX', () => {
      const svg = '<svg><circle cx="50" cy="50" r="40" /></svg>';
      const result = compileSvg(svg);

      assert.ok(result.includes('export default (props = {}) =>'));
      assert.ok(result.includes('circle'));
    });

    test('should handle SVG with multiple elements', () => {
      const svg = `
        <svg>
          <circle cx="50" cy="50" r="40" />
          <rect x="10" y="10" width="30" height="30" />
          <path d="M10 10 L90 90" />
        </svg>
      `;
      const result = compileSvg(svg);

      assert.ok(result.includes('rect'));
      assert.ok(result.includes('path'));
    });

    test('should handle SVG with attributes', () => {
      const svg = '<svg><circle cx="50" cy="50" r="40" stroke-width="2" stroke="blue" /></svg>';
      const result = compileSvg(svg);

      assert.ok(result.includes('stroke-width'));
      assert.ok(result.includes('stroke'));
    });

    test('should handle empty SVG', () => {
      const svg = `
        <?xml version="1.0" encoding="UTF-8"?>
        <svg></svg>
      `;
      const result = compileSvg(svg);

      assert.ok(!result.includes('<?xml'));
      assert.ok(result.includes('export default (props = {}) =>'));
    });
  });

  describe('optimizeSvg', () => {
    test('should optimize SVG with SVGO', async () => {
      const svg = `
        <svg>
          <?xml version="1.0" encoding="UTF-8"?>
          <metadata>Test metadata</metadata>
          <circle id="useless" cx="50" cy="50" r="40" />
          <rect id="helpful" x="10" y="10" width="30" height="30" />
        </svg>
      `;

      const svgoConfig: Config = {
        plugins: [
          'removeMetadata',
          'removeTitle',
          {
            name: 'cleanupIds',
            params: { preserve: ['helpful'] },
          },
        ],
      };

      const result = await optimizeSvg(svg, '/test/file.svg', svgoConfig);

      assert.ok(!result.includes('metadata'));
      assert.ok(!result.includes('useless'));
      assert.ok(!result.includes('title'));

      assert.ok(result.includes('xml'));
      assert.ok(result.includes('circle'));
      assert.ok(result.includes('rect'));
      assert.ok(result.includes('helpful'));
    });

    test('should throw error on datauri config', async () => {
      const svg = '<svg><circle cx="50" cy="50" r="40" /></svg>';

      const svgoConfig: Config = {
        datauri: 'base64',
      };

      try {
        await optimizeSvg(svg, '/test/file.svg', svgoConfig);
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('Data URI'));
      }
    });
  });
});
