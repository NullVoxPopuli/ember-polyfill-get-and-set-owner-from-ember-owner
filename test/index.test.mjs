import babel from "@babel/core";
import plugin from "../src/index.js";

describe("babel-plugin-ember-polyfill-get-and-set-owner-from-ember-owner", () => {
  function transform(code) {
    return babel.transformSync(code, {
      plugins: [plugin],
      parserOpts: {
        sourceType: "module",
      },
    }).code;
  }

  test('does nothing if nothing needs to happen', () => {
    const input = "import { getOwner } from '@ember/application';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`"import { getOwner } from '@ember/application';"`);
  });

  test('renames', () => {
    const input = "import { getOwner } from '@ember/owner';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`"import { getOwner } from "@ember/application";"`);
  });

  test('handles both getOwner and setOwner', () => {
    const input = "import { getOwner, setOwner } from '@ember/owner';";
    const output = transform(input);
    expect(output).toMatchInlineSnapshot(`"import { getOwner, setOwner } from "@ember/application";"`);
  });
});
