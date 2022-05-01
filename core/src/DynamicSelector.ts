import { dynamicSelectorMethods } from './DynamicSelector-methods';
import { parentMethods } from './ParentNode-methods';
import { AtomOrSelector, DynamicSelector, ListenerListener } from './types';

export const DYNAMIC_SELECTOR_PROTOTYPE = {
  ...parentMethods,
  ...dynamicSelectorMethods,
};

export function dynamicSelector<Return>(params: {
  id?: string;
  inputs?: AtomOrSelector<Return>;
  func: (get: <T>(node: AtomOrSelector<T>) => T) => Return;
  listenersChanged?: ListenerListener;
  metadata?: any;
}): DynamicSelector<Return>;

export function dynamicSelector<Return>(
  func: (get: <T>(node: AtomOrSelector<T>) => T) => Return
): DynamicSelector<Return>;

export function dynamicSelector(params) {
  if (typeof params === 'function') {
    params = { func: params };
  }
  const state = {
    metadata: params.metadata,
    cacheInputs: new Map(),
    cacheVal: new Map(),
    func: params.func,

    id: params.id || '-',
    dependencies: [],
    dependants: [],
    dynDependencies: new Map(),
    dynDependants: new Map(),
    listeners: new Map(),
    listenersChanged: params.listenersChanged || null,
    useCache: new Map(),

    __proto__: DYNAMIC_SELECTOR_PROTOTYPE,
  };

  for (let i = 0; i < state.dependencies.length; i++) {
    state.dependencies[i].addDependant(state);
  }
  return state as any;
}
