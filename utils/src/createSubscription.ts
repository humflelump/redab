import { AtomOrSelector, Listener, Selector } from 'redab-core';
import { atom } from 'redab-core';
import { selector } from 'redab-core';
import { createId } from './helpers/createId';

type SetterVal<T> = T | ((val: T) => T);

export function createSubscription<Return>(params: {
  id?: string;
  defaultValue: Return;
  inputs?: [];
  onSubscribe: (
    vals: [],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: []) => void;
    onInputsChanged?: (current: [], prev: [] | null) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [AtomOrSelector<R1>];
  onSubscribe: (
    vals: [R1],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1]) => void;
    onInputsChanged?: (current: [R1], prev: [R1] | null) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1, R2>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [AtomOrSelector<R1>, AtomOrSelector<R2>];
  onSubscribe: (
    vals: [R1, R2],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1, R2]) => void;
    onInputsChanged?: (current: [R1, R2], prev: [R1, R2] | null) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1, R2, R3>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [AtomOrSelector<R1>, AtomOrSelector<R2>, AtomOrSelector<R3>];
  onSubscribe: (
    vals: [R1, R2, R3],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1, R2, R3]) => void;
    onInputsChanged?: (
      current: [R1, R2, R3],
      prev: [R1, R2, R3] | null
    ) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1, R2, R3, R4>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [
    AtomOrSelector<R1>,
    AtomOrSelector<R2>,
    AtomOrSelector<R3>,
    AtomOrSelector<R4>
  ];
  onSubscribe: (
    vals: [R1, R2, R3, R4],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1, R2, R3, R4]) => void;
    onInputsChanged?: (
      current: [R1, R2, R3, R4],
      prev: [R1, R2, R3, R4] | null
    ) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1, R2, R3, R4, R5>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [
    AtomOrSelector<R1>,
    AtomOrSelector<R2>,
    AtomOrSelector<R3>,
    AtomOrSelector<R4>,
    AtomOrSelector<R5>
  ];
  onSubscribe: (
    vals: [R1, R2, R3, R4, R5],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1, R2, R3, R4, R5]) => void;
    onInputsChanged?: (
      current: [R1, R2, R3, R4, R5],
      prev: [R1, R2, R3, R4, R5] | null
    ) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription<Return, R1, R2, R3, R4, R5, R6>(params: {
  id?: string;
  defaultValue: Return;
  inputs: [
    AtomOrSelector<R1>,
    AtomOrSelector<R2>,
    AtomOrSelector<R3>,
    AtomOrSelector<R4>,
    AtomOrSelector<R5>,
    AtomOrSelector<R6>
  ];
  onSubscribe: (
    vals: [R1, R2, R3, R4, R5, R6],
    setter: (f: SetterVal<Return>) => void
  ) => {
    onUnsubscribe: (values: [R1, R2, R3, R4, R5, R6]) => void;
    onInputsChanged?: (
      current: [R1, R2, R3, R4, R5, R6],
      prev: [R1, R2, R3, R4, R5, R6] | null
    ) => void;
    onSubscriptionsChanged?: (
      newListeners: Listener[],
      prevListeners: Listener[]
    ) => void;
  };
}): Selector<Return>;

export function createSubscription(params) {
  const { defaultValue, onSubscribe } = params;
  const id = params.id || '-';
  const inputs = params.inputs || [];
  const uid = createId();

  const metadata = { subscription: uid, id };
  const [subAtom, inputsCacheAtom, subResultAtom] = [
    defaultValue,
    null,
    void 0,
  ].map((data, i) => {
    return atom({
      id: `${i}_${id}`,
      data,
      multi: true,
      metadata,
    });
  });

  const subSelector = selector({
    id: `s_${id}`,
    inputs,
    metadata,
    func: (...vals) => {
      const outputs = vals.slice(0, vals.length - 1);
      const key = vals[vals.length - 1];
      const prevOutputs = inputsCacheAtom.get(key);
      inputsCacheAtom.set(outputs, key);
      const funcs = subResultAtom.get(key);
      funcs?.onInputsChanged?.(outputs, prevOutputs);
    },
    listenersChanged: (cur, prev, key) => {
      if (cur.length > 0 && prev.length === 0) {
        const vals = inputs.map((d) => d.get(key));
        const set = (val) =>
          typeof val === 'function'
            ? subAtom.update(val, key)
            : subAtom.set(val, key);
        subResultAtom.set(onSubscribe(vals, set), key);
      }
      const funcs = subResultAtom.get(key);
      funcs.onSubscriptionsChanged?.(cur, prev);

      if (cur.length === 0 && prev.length > 0) {
        const vals = inputs.map((d) => d.get(key));
        funcs.onUnsubscribe(vals);
      }
    },
  });

  const resultSelector = selector({
    id: `subscription_${id}`,
    inputs: [subSelector, subAtom],
    func: (a, b) => b,
    metadata,
  });

  return resultSelector as any;
}
