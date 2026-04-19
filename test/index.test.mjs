import babel from "@babel/core";
import plugin from "../src/index.js";

describe("babel-plugin-ember-polyfill-get-and-set-owner-from-ember-owner", () => {
  function transform(code, filename) {
    return babel.transformSync(code, {
      plugins: [plugin],
      filename,
      parserOpts: {
        sourceType: "module",
      },
    }).code;
  }

  test("does nothing if nothing needs to happen", () => {
    const input = "import { getOwner } from '@ember/application';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(
      `"import { getOwner } from '@ember/application';"`,
    );
  });

  test("renames", () => {
    const input = "import { getOwner } from '@ember/owner';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(
      `"import { getOwner } from "@ember/application";"`,
    );
  });

  test("handles both getOwner and setOwner", () => {
    const input = "import { getOwner, setOwner } from '@ember/owner';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(
      `"import { getOwner, setOwner } from "@ember/application";"`,
    );
  });

  test("skips files inside ember-source (node_modules)", () => {
    // ember-source >= 4.12 re-exports getOwner/setOwner from @ember/owner.
    // Rewriting those imports turns the module into a self-import.
    const input =
      "import { getOwner as actualGetOwner } from '@ember/owner';\n" +
      "export const getOwner = actualGetOwner;";
    const output = transform(
      input,
      "/workspace/app/node_modules/ember-source/@ember/application/index.js",
    );
    expect(output).toContain("from '@ember/owner'");
    expect(output).not.toContain('from "@ember/application"');
  });

  test("skips files inside ember-source even when copied into .embroider/rewritten-packages", () => {
    const input =
      "import { getOwner as actualGetOwner } from '@ember/owner';\n" +
      "export const getOwner = actualGetOwner;";
    const output = transform(
      input,
      "/workspace/app/node_modules/.embroider/rewritten-packages/ember-source.abcd1234/node_modules/ember-source/@ember/application/index.js",
    );
    expect(output).toContain("from '@ember/owner'");
    expect(output).not.toContain('from "@ember/application"');
  });

  test("still rewrites user / third-party code that lives under .embroider/rewritten-packages", () => {
    const input = "import { setOwner } from '@ember/owner';";
    const output = transform(
      input,
      "/workspace/app/node_modules/.embroider/rewritten-packages/@glimmer/component.5678/node_modules/@glimmer/component/dist/index.js",
    );
    expect(output).toContain('from "@ember/application"');
  });
});
