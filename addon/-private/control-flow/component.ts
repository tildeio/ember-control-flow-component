// Inspiration:
// https://github.com/glimmerjs/glimmer.js/blob/master/packages/%40glimmer/component/addon/-private/component.ts
// https://github.com/rwjblue/sparkles-component/blob/master/addon/index.ts
import { setOwner } from '@ember/application';

const DESTROYING = new WeakMap<BaseComponent<unknown>, boolean>();
const DESTROYED = new WeakMap<BaseComponent<unknown>, boolean>();

export function setDestroying(component: BaseComponent<unknown>) {
  DESTROYING.set(component, true);
}
export function setDestroyed(component: BaseComponent<unknown>) {
  DESTROYED.set(component, true);
}

export default class BaseComponent<T = any[]> {
  args: Readonly<T>;

  constructor(owner: unknown, args: T) {
    this.args = args;
    setOwner(this, owner);

    DESTROYING.set(this, false);
    DESTROYED.set(this, false);
  }

  /**
   * Called after the component has received new args
   * and after all of the sub-components have been rendered.
   */
  didUpdate() {}

  /**
   * Called before the component has been removed from the DOM.
   */
  willDestroy() {}

  get isDestroying(): boolean {
    return Boolean(DESTROYING.get(this));
  }

  get isDestroyed(): boolean{
    return Boolean(DESTROYED.get(this));
  }
}
