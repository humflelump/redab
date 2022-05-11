import { DEFAULT_STORE, IStore } from '../Store';
import { sharedMethods } from '../shared-methods';
import { Atom, AtomMiddleware, ListenerListener } from '../types';
import { atomMethods } from './methods';

export const ATOM_PROTOTYPE = { ...sharedMethods, ...atomMethods };

export function atom<Return>(params: {
  data: Return | ((key: any) => Return);
  multi?: boolean;
  id?: string;
  metadata?: any;
  listenersChanged?: ListenerListener;
  middleware?: AtomMiddleware<Return>[];
  store?: IStore;
}): Atom<Return>;

export function atom<Return>(data: Return): Atom<Return>;

export function atom(p) {
  if (!p || typeof p !== 'object' || !('data' in p)) {
    p = { data: p, id: '-' };
  }
  const store: IStore = p.store || DEFAULT_STORE;
  const state: any = {
    data: new Map(),
    init: typeof p.data === 'function' ? p.data : () => p.data,
    multi: p.multi === void 0 ? false : p.multi,
    metadata: 'metadata' in p ? p.metadata : null,
    middleware: p.middleware || [],
    id: p.id || '-',
    //dependencies: [],
    dependants: [],
    keyDependants: new Map(),
    fullDependants: new Map(),

    //dynDependencies: new Map(),
    //dynDependants: new Map(),
    keyListeners: new Map(),
    fullListeners: new Map(),

    setCount: 0,
    listenersChanged: p.listenersChanged || null,
    store,
    notifyListeners: new Map(), // true
    __proto__: ATOM_PROTOTYPE,
  };
  store.atomCreated(state);
  return state;
}
