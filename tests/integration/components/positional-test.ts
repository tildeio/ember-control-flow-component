import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import Service, { inject as service } from '@ember/service';
import { ControlFlowComponent } from 'ember-control-flow-component';

module('Integration | Component | positional', function(hooks) {
  setupRenderingTest(hooks);

  module('essential behavior', function() {
    test('lifecycles', async function(assert) {
      assert.expect(7);

      type Args = { positional: number[] };

      this.owner.register(
        'component:foo',
        class Foo extends ControlFlowComponent<Args> {
          constructor() {
            super(...arguments);

            assert.equal(this.args.positional[0], 2, 'constructor:0');
            assert.equal(this.args.positional[1], undefined, 'constructor:1');
          }
          didReceiveArgs() {
            assert.equal(this.args.positional[0], 3, 'didReceiveArgs:0');
            assert.equal(this.args.positional[1], 4, 'didReceiveArgs:1');
          }
          didUpdate() {
            assert.equal(this.args.positional[0], 3, 'didUpdate:0');
            assert.equal(this.args.positional[1], 4, 'didUpdate:1');
          }
          willDestroy() {
            assert.ok(true, 'willDestroy');
          }
        }
      );

      this.setProperties({ foo: 2 });

      await render(hbs`
        {{#foo this.foo this.bar}}
          boop
        {{/foo}}
      `);

      this.setProperties({ foo: 3, bar: 4 });

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

      await render(hbs`{{foo}}`);
    });
  });

  module('examples', function() {
    test('await promise', async function(assert) {
      assert.expect(0);
    });
  });
});
