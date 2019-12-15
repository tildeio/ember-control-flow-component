import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import Service, { inject as service } from '@ember/service';
import { ControlFlowComponent } from 'ember-control-flow-component';

module('Integration | Component | positional', function(hooks) {
  setupRenderingTest(hooks);

  test('lifecycles', async function(assert) {
    assert.expect(3);

    type Args = [number];

    this.owner.register(
      'component:foo',
      class Foo extends ControlFlowComponent<Args> {
        constructor() {
          super(...arguments);

          assert.equal(this.args[0], 2, 'constructor receives args');
        }

        didUpdate() {
          assert.equal(this.args[0], 3, 'didUpdate');
        }

        willDestroy() {
          assert.ok(true, 'willDestroy');
        }
      }
    );

    this.setProperties({ foo: 2 });

    await render(hbs`
      {{#foo this.foo}}
        boop
      {{/foo}}
    `);

    this.setProperties({ foo: 3 });

    await settled();
    await clearRender();
  });

  test('injection', async function(assert) {
    assert.expect(1);

    this.owner.register(
      'service:bar',
      class extends Service {
        bar = 2;
      }
    );

    this.owner.register(
      'component:foo',
      class Foo extends ControlFlowComponent {
        @service bar;

        constructor() {
          super(...arguments);

          assert.equal(this.bar.bar, 2, 'Service value accessible');
        }
      }
    );

    await render(hbs`<Foo />`);
  });
});
