# rspack-plugin-solid-svg

![CI](https://github.com/solarlime/rspack-plugin-solid-svg/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/rspack-plugin-solid-svg.svg)](https://badge.fury.io/js/rspack-plugin-solid-svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)

Webpack/Rspack/Rsbuild plugin for transforming SVG files into SolidJS components. ESM only.

## Overview

This plugin allows you to import SVG files to SolidJS components in your webpack/rspack/rsbuild projects. It works in two modes:
- SVG files added with `.svg?solid` are transformed into SolidJS components. By default, they are optimized with SVGO.
- SVG files added with `.svg` are imported as URLs (Rspack/Webpack) or use default handling (Rsbuild).

## Installation

```bash
npm install -D rspack-plugin-solid-svg
# or
pnpm add -D rspack-plugin-solid-svg
# or
yarn add -D rspack-plugin-solid-svg
```

## Usage

### Basic Setup

#### For Rsbuild

```javascript
// rsbuild.config.js
import { defineConfig } from '@rsbuild/core';
import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg/rsbuild';
// or: import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg';

export default defineConfig({
  plugins: [
    rsbuildPluginSolidSvg()
  ]
});
```

#### For Rspack/Webpack

```javascript
// rspack.config.js or webpack.config.js
import { RspackPluginSolidSvg } from 'rspack-plugin-solid-svg/rspack';
// or: import { RspackPluginSolidSvg } from 'rspack-plugin-solid-svg';

export default {
  plugins: [
    new RspackPluginSolidSvg()
  ]
};
```

### Importing SVGs

#### As SolidJS Component

```javascript
import Icon from './icon.svg?solid';

function App() {
  return (
    <div>
      <Icon width={24} height={24} fill="red" />
    </div>
  );
}
```

#### As Asset URL

```javascript
import iconUrl from './icon.svg';

function App() {
  return (
    <div>
      <img src={iconUrl} alt="Icon" />
    </div>
  );
}
```

## Configuration

### Rspack/Webpack

```javascript
new RspackPluginSolidSvg({
  svgo: {
    enabled: true,
    svgoConfig: {
      // Default SVGO configuration
    }
  }
})
```

### Custom SVGO Configuration

```javascript
new RspackPluginSolidSvg({
  svgo: {
    enabled: true,
    svgoConfig: {
      plugins: [
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        {
          name: 'removeAttrs',
          params: {
            attrs: '(data-name|data-id)'
          }
        },
        {
          name: 'addAttributesToSVGElement',
          params: {
            attributes: [
              { 'fill': 'currentColor' }
            ]
          }
        }
      ]
    }
  }
})
```

### Disable SVGO

```javascript
new RspackPluginSolidSvg({
  svgo: {
    enabled: false
  }
})
```

### Rsbuild

```javascript
// rsbuild.config.js
import { defineConfig } from '@rsbuild/core';
import { rsbuildPluginSolidSvg } from 'rspack-plugin-solid-svg/rsbuild';

export default defineConfig({
  plugins: [
    rsbuildPluginSolidSvg({
      svgo: {
        enabled: true,
        svgoConfig: {
          plugins: ['removeMetadata', 'removeTitle']
        }
      }
    })
  ]
});
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `svgo.enabled` | `boolean` | `true` | Enable/disable SVGO optimization |
| `svgo.svgoConfig` | `object` | `{}` | SVGO configuration object |

## Generated Component

The plugin generates SolidJS components with the following signature:

```javascript
export default (props = {}) => (
  <svg {...props}>
    {/* SVG content here */}
  </svg>
);
```

### Props

All props are spread onto the SVG element, allowing you to:

- Set dimensions: `width`, `height`
- Add styling: `fill`, `stroke`, `class`
- Add event handlers: `onClick`, `onMouseOver`
- Add accessibility: `aria-label`, `role`

### Example

```javascript
import Star from './star.svg?solid';

function Rating({ rating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          width={20}
          height={20}
          fill={value <= rating ? 'gold' : 'gray'}
          class="star-icon"
          onClick={() => setRating(value)}
        />
      ))}
    </div>
  );
}
```

## SVGO Integration

The plugin uses [SVGO](https://github.com/svg/svgo) for SVG optimization. Common optimizations include:

- Remove metadata and comments
- Remove unused elements and attributes
- Optimize paths and shapes
- Minify SVG code
- Convert colors to more efficient formats

## Using loader directly

If you need to change the `.svg` resolution behavior, you can use the loader directly:

```javascript
// webpack.config.js
import { RspackPluginSolidSvg } from 'rspack-plugin-solid-svg';

export default {
  // Other settings
  // ...
  rules: [
    // Other rules
    // ...
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
  ]
};
```
In Rsbuild it can be reached by modifying the rspack config:

```javascript
// rsbuild.config.js
import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';

import { RspackPluginSolidSvg } from 'rspack-plugin-solid-svg';

export default defineConfig({
  server: {
    open: false,
  },
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions: {
        presets: ['solid'],
      },
    }),
    pluginSolid(),
  ],
  tools: {
    rspack: {
      module: {
        rules: [
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
                loader: RspackPluginSolidSvg.loader,
                options: {
                  svgo: { enabled: false },
                },
              },
            ],
            type: 'javascript/auto',
          },
          {
            test: /\.svg$/,
            resourceQuery: { not: [/\?solid/] },
            type: 'asset/resource',
            generator: {
              filename: 'assets/[name].[hash][ext]',
            },
          },
        ],
      },
    },
  },
});
```

## TypeScript Support

For TypeScript, you need to add the following declarations:

```typescript
declare module '*.svg?solid' {
  import type { Component, ComponentProps } from 'solid-js';
  const c: Component<ComponentProps<'svg'>>;
  export default c;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
```

## License

MIT License - see [LICENSE](LICENSE) for details.
