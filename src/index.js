module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "undeprecate-inject-from-at-ember-service",
    visitor: {
      ImportDeclaration(path, state) {
        if (state.filename.includes('/ember-source/') return;

        // Only process imports from '@ember/owner'
        if (path.node.source.value !== "@ember/owner") {
          return;
        }

        path.node.source.value = '@ember/application';
      },
    },
  };
};
