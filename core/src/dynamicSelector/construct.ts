import { dynamicSelectorMethods } from './methods';
import { sharedMethods } from '../shared-methods';
import { AtomOrSelector, DynamicSelector, ListenerListener } from '../types';

export const DYNAMIC_SELECTOR_PROTOTYPE = {
  ...sharedMethods,
  ...dynamicSelectorMethods,
};

export function dynamicSelector<Return>(params: {
  id?: string;
  func: (
    get: <T>(node: AtomOrSelector<T>) => T,
    getAll: <T>(node: AtomOrSelector<T>) => Map<any, T>
  ) => Return;
  listenersChanged?: ListenerListener;
  metadata?: any;
}): DynamicSelector<Return>;

export function dynamicSelector<Return>(
  func: (
    get: <T>(node: AtomOrSelector<T>) => T,
    getAll: <T>(node: AtomOrSelector<T>) => Map<any, T>
  ) => Return
): DynamicSelector<Return>;

export function dynamicSelector(p) {
  if (typeof p === 'function') {
    p = { func: p };
  }
  const state = {
    data: new Map(),
    func: p.func,

    cacheInputs: new Map(),
    cacheCounts: null,

    keyDependencies: new Map(),
    fullDependencies: new Map(),

    keyDependants: new Map(),
    fullDependants: new Map(),

    keyListeners: new Map(),
    fullListeners: new Map(),

    setCount: 0,
    listenersChanged: p.listenersChanged || null,
    id: p.id || '-',
    metadata: p.metadata,
    useCache: new Map(),

    __proto__: DYNAMIC_SELECTOR_PROTOTYPE,
  };

  return state as any;
}
