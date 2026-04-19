module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "undeprecate-inject-from-at-ember-service",
    visitor: {
      ImportDeclaration(path, state) {
        // ember-source's own `@ember/application/index.js` re-exports
        // `getOwner`/`setOwner` by importing them from `@ember/owner`:
        //
        //     import { getOwner as actualGetOwner, setOwner as actualSetOwner }
        //       from '@ember/owner';
        //     export const getOwner = actualGetOwner;
        //     export const setOwner = actualSetOwner;
        //
        // Rewriting that to `from '@ember/application'` turns the module
        // into a self-import; rollup then collapses it to
        // `const getOwner = getOwner`, which trips TDZ at load time.
        //
        // Skip anything whose filename is inside ember-source's package,
        // regardless of whether it lives in node_modules directly or has
        // been copied into `.embroider/rewritten-packages/` by
        // @embroider/compat.
        if (state.filename?.includes("/ember-source/")) {
          return;
        }

        // Only process imports from '@ember/owner'
        if (path.node.source.value !== "@ember/owner") {
          return;
        }

        path.node.source.value = "@ember/application";
      },
    },
  };
};
