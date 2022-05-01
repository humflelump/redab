import {
  atom,
  selector,
  dynamicSelector,
  ListenerListener,
  Listener,
  AtomMiddleware,
  ParentType,
  Atom,
  Selector,
  DynamicSelector,
  AtomOrSelector,
  IStore,
  isAtom,
  isDynamicSelector,
  isSelector,
  DEFAULT_STORE,
  Store,
} from 'redab-core';

import { createAction } from './createAction';
import { createMolecule } from './createMolecule';
import { createAsyncAction } from './createAsyncAction';
import { createAsyncSelector } from './createAsyncSelector';
import { createThrottledSelector } from './createThrottledSelector';
import { createSubscription } from './createSubscription';
import { injectKey, isAction } from './action-helpers';

import {
  Action,
  Setter,
  AsyncSelectorPromiseState,
  AsyncActionState,
  Atomify,
  AnyFunction,
} from './types';

export {
  atom,
  selector,
  dynamicSelector,
  ListenerListener,
  Listener,
  AtomMiddleware,
  ParentType,
  Atom,
  Selector,
  DynamicSelector,
  AtomOrSelector,
  IStore,
  AnyFunction,
  isAtom,
  isDynamicSelector,
  isSelector,
  DEFAULT_STORE,
  Store,
};

export { Action, Setter, AsyncSelectorPromiseState, AsyncActionState, Atomify };

function test<R>(props: { f: () => R; f2: (d: R) => void }) {
  return true;
}

test({
  f: () => false,
  f2: (n) => {},
});

export {
  createAction,
  createMolecule,
  createAsyncAction,
  createAsyncSelector,
  createThrottledSelector,
  createSubscription,
  injectKey,
  isAction,
};
