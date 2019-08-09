# ember-control-flow-component

[![Build Status](https://travis-ci.com/tildeio/ember-control-flow-component.svg?branch=master)](https://travis-ci.com/tildeio/ember-control-flow-component)

When writing modern Ember apps, [Glimmer Component](todo://link-to-somewhere)
is probably your go-to component superclass.

As great as they are, there is a downside – they do not support positional
arguments, only named arguments (`@foo`, `@bar`, etc) are supported. This is
not usually a problem, because there is no way to pass them using the [angle
bracket invocation](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md)
syntax anyway. Since this is how you would want to invoke your components in
modern Ember apps, it makes perfect sense that Glimmer Components omitted
support for taking positional arguments.

That is all great and cool until you are trying to build a "control-flow"
component. You see, one of the great things about using angle brackets for
components are that they visually distinguish components invocations (which
looks more like HTML now) against "control-flow" elements (such as `{{#if}}`,
`{{#each}}`) and helpers, making each of them stand out in their own way and
easy to notice at a glance.

What if you are trying to implement your own "control-flow" component?
To match the style "guideline" from above, you would probably want them to be
invoked with curlies and primarily using positional arguments. Check out the
[`{{#async-await}}` "helper" addon](https://github.com/tildeio/ember-async-await-helper)
for a real-world example. In order to take positional arguments, you would have
to go back to using `Ember.Component` as your superclass, and who wants that?

Meet `ember-control-flow-component`, your new, modern, minimal, light-weight
superclass for all your "control-flow" component needs.

## Installation

```
ember install ember-control-flow-component
```

## Usage

Compared to the Glimmer Components API, the main difference is that the `args`
object has the following interface:

```ts
interface Args {
  positional: unknown[];
  named: NamedArgs;
}

interface NamedArgs {
  [name: string]: unknown;
}
```

In English, `this.args.positional` is an array of the positional arguments
passed into the component, and `this.args.named` is an object ("dictionary",
"hash", ...) with the named arguments.

To see this in action, let's build a simplified version of [`{{#async-await}}`](https://github.com/tildeio/ember-async-await-helper).

```js
// addon/components/async-await.js

import ControlFlowComponent from 'ember-control-flow-component';
import { tracked } from '@glimmer/tracking';

const UNINITIALIZED = Object.create(null);

export default class AsyncAwait extends ControlFlowComponent {
  /**
    The value to await, passed as a positional argument.
    @private
    @property value
    @type any
  */
  get value() {
    return this.args.positional[0];
  }

  /**
    The most-recently awaited value.
    @private
    @property value
    @type any
  */
  awaited = UNINITIALIZED;

  /**
    The result from awaiting the value.
    @private
    @property
    @type AwaitResult
  */
  get result() {
    // Nothing changed since we last awaited: same result.
    if (this.value === this.awaited) {
      return this._result;
    }

    // Otherwise, the value must have changed: new result.
    let value = this.awaited = this.value;
    let result = this._result = new AwaitResult(value);

    return result;
  }
}

class AwaitResult {
  /**
    Whether the promise has been resolved. If `true`, the resolution value can
    be found in `resolvedValue`.
    @private
    @property isResolved
    @type Boolean
    @default false
  */
  @tracked isResolved = false;

  /**
    If the promise has been resolved, this will contain the resolved value.
    @private
    @property resolvedValue
    @type any
  */
  @tracked resolvedValue = UNINITIALIZED;

  constructor(value) {
    Promise.resolve(awaited).then(resolvedValue => {
      this.isResolved = true;
      this.resolvedValue = resolvedValue;
    });
  }
}
```

```hbs
{{!-- addon/components/async-await.hbs --}}

{{#if this.result.isResolved}}
  {{yield this.result.resolvedValue}}
{{else}}
  {{yield to="inverse"}}
{{/if}}
```

The [actual code](https://github.com/tildeio/ember-async-await-helper/blob/master/addon/components/async-await.js)
is slightly more robust, but the simplified version we have here is a good
example of how the `ember-control-flow-component` API works in practice.

## Should I use this?

When in doubt, the answer is probably no. Most components are _presentational_,
they benefit from the closer-to-HTML look of angle bracket invocations, so they
should not take positional arguments. Glimmer Components are just fine in those
cases.

However, as we mentioned above, there are of course exceptions to the above.
These are some good examples that we know of:

* [`{{#async-await}}`](https://github.com/tildeio/ember-async-await-helper)
* [`{{#animated-if}}`](https://ember-animation.github.io/ember-animated/docs/api/components/animated-if)
* [`{{#animated-each}}`](https://ember-animation.github.io/ember-animated/docs/api/components/animated-each)

The general guidelines are to think about what invocation style feels and looks
more appropriate. If your component looks and quacks like one of the built-in
control-flow, helper-y things in Ember, you may have a valid use case. Use your
best judgment.

It is an open question whether "provider" components that purely set up some
state and yield it to its children without adding any markup falls into this
category or not. Our hunch is yes, but we will have to experiment more as a
community to get a better sense of whether it's worth it.

If you _do_ decide to use this, you should consistently adopt the "curly"
invocation style in your examples and documentation, and strongly encourage
your users to do the same (this will probably happen naturally anyway, as you
simply cannot pass the required positional arguments with angle bracket).

It _may_ help avoid confusion if you refer to your addon as a "helper" rather
than a component? This is what we did with `{{#async-await}}`. Again, we will
have to experiment more as a community to see whether this is really helpful or
just causes more confusion in practice.

Finally, even if your component primarily takes positional arguments, you
should definitely take named arguments where they make sense. For example,
`{{#each}}` takes `key=` as a named argument, and `{{#async-await}}` has
`onReject=`. Do note that, in curly invocations, there is no `@` prefix for
named arguments.

## Contributing

### Installation

* `git clone <repository-url>`
* `cd ember-control-flow-component`
* `yarn install`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).
