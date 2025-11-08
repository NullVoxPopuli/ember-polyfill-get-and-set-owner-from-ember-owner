import { module, test } from 'qunit';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

module('@glimmer/component 2', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    await render(hbs`
      <Demo />
    `);

    assert.dom('output').hasText('0');
    await click('button');
    assert.dom('output').hasText('1');
  });
});
