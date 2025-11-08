# Babel Plugin: Polyfill for `getOwner` and `setOwner` from `@ember/owner` 

A Babel plugin for older projects that enables usage of newer libraries.

The cutoff for this change finally happened in ember-source 4.12.0 -- and is believed to have been an accidental [breaking change](https://deprecations.emberjs.com/v4.x) for consumers. This lead library authors wanting to bridge earlier and newer ember-source versions to implement various work-arounds [like this](https://github.com/NullVoxPopuli/ember-resources/blob/main/ember-resources/src/ember-compat.ts).

Not all addons are as willing to retain support for `@ember/application` though.

Using this polyfill babel plugin allows you to use newer addons that only use `@ember/owner`.

> [!NOTE]
> This babel plugin is not needed if you are on ember-source 4.12 or newer.

## What it does

This plugin transforms the following import patterns:

- `import { getOwner } from '@ember/owner'` → `import { getOwner } from '@ember/application'`
- `import { setOwner } from '@ember/owner'` → `import { setOwner } from '@ember/application'`


Allowing you to user newer versions of libraries (v2 addons as well), resulting in improved build performance and longer lasting compatibility with the ecosystem.

## Installation

```bash
pnpm add -D babel-plugin-ember-polyfill-get-and-set-owner-from-ember-owner 
```

## Usage

Add the plugin to your Babel configuration:

```js
// ember-cli-build.js
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // transforms your own app
    babel: {
      plugins: [
        [
          require.resolve(
            "babel-plugin-ember-polyfill-get-and-set-owner-from-ember-owner",
          ),
          {},
        ],
      ],
    },
    autoImport: {
      webpack: {
        module: {
          rules: [
            // transforms v2 addon code
            {
              test: (filename) => {
                return filename.endsWith(".js");
              },
              use: {
                loader: "babel-loader-8",
                options: {
                  plugins: [
                    require.resolve(
                      "babel-plugin-ember-polyfill-get-and-set-owner-from-ember-owner",
                    ),
                  ],
                },
              },
            },
          ],
        },
      },
    },
  });

  return app.toTree();
};
```

## Examples

### Before

```javascript
import { getOwner, setOwner } from "@ember/owner";
```

### After

```javascript
import { getOwner, setOwner } from "@ember/application";
```

## Development

```bash
pnpm install
pnpm test
```

Tests are written using Vitest.

## License

MIT
