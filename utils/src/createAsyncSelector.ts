import { createAsyncAction } from './createAsyncAction';
import { atom } from 'redab-core';
import { selector } from 'redab-core';
import { AtomOrSelector, Selector } from 'redab-core';
import { createId } from './helpers/createId';
import { AsyncSelectorPromiseState } from './types';
import { Action } from '.';

export function createAsyncSelector<ReturnType, DefaultValue = null>(params: {
  defaultValue: DefaultValue;
  inputs?: [];
  func: (state: AsyncSelectorPromiseState<ReturnType>) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: () => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [AtomOrSelector<S1>];
  func: (
    val1: S1,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (val1: S1) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>];
  func: (
    val1: S1,
    val2: S2,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (val1: S1, val2: S2) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>, AtomOrSelector<S3>];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5
  ) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6
  ) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7
  ) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>,
    AtomOrSelector<S8>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8
  ) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  ReturnType,
  DefaultValue = null
>(params: {
  defaultValue: DefaultValue;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>,
    AtomOrSelector<S8>,
    AtomOrSelector<S9>
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    val9: S9,
    state: AsyncSelectorPromiseState<ReturnType>
  ) => Promise<ReturnType>;
  id?: string;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    val9: S9
  ) => boolean;
  throttle?: (f: () => void) => () => void;
  onResolve?: (result: ReturnType) => void;
  onReject?: (err: Error) => void;
}): [
  Selector<ReturnType | DefaultValue>,
  Selector<boolean>,
  Selector<any | undefined>,
  Action<() => Promise<ReturnType>>
];

export function createAsyncSelector(params) {
  const { func, inputs } = params;
  const nop = (_) => _;
  const throttle = params.throttle || nop;
  const shouldUseAsync = params.shouldUseAsync || (() => true);
  const id = params.id || '-';
  const uid = createId();
  const defaultValue = 'defaultValue' in params ? params.defaultValue : null;

  const metadata = { asyncSelector: uid, id };
  const DEFAULT_ATOM = {
    multi: true,
    metadata,
  };

  const [isLoadingAtom, errorAtom, valueAtom, callState, forceUpdateAtom] = [
    false,
    void 0,
    defaultValue,
    null,
    '-',
  ].map((data, i) =>
    atom({
      id: `atom_${i}_${id}`,
      data,
      ...DEFAULT_ATOM,
    })
  );

  const [isLoadingSelector, errorSelector] = [isLoadingAtom, errorAtom].map(
    (atom, i) =>
      selector({
        id: `selector_${i}_${id}`,
        inputs: [atom],
        func: nop,
        metadata,
      })
  );

  const funcAtom = atom({
    ...DEFAULT_ATOM,
    data: () =>
      throttle((vals, key, callId) => {
        const state = callState.get(key);
        if (state.callId !== callId) return;
        func(...vals, state)
          .then((res) => {
            if (state.cancelled) return;
            callState.set(null, key);
            valueAtom.set(res, key);
            errorAtom.set(void 0, key);
            isLoadingAtom.set(false, key);
            state.onResolve(res);
          })
          .catch((err) => {
            if (state.cancelled) return;
            callState.set(null, key);
            errorAtom.set(err, key);
            isLoadingAtom.set(false, key);
            state.onReject(err);
          });
      }),
  });

  const asyncSelector = selector({
    id: 'wow',
    inputs: [...inputs, forceUpdateAtom] as any,
    func: (...d) => {
      const vals = d.slice(0, d.length - 2);
      const key = d[d.length - 1];
      if (!shouldUseAsync(...vals)) return;
      const prevState = callState.get(key);
      if (prevState) {
        prevState.cancelled = true;
        prevState.onCancel();
        errorAtom.set(void 0, key);
      }
      const callId = createId();
      const newState = {
        callId,
        cancelled: false,
        onCancel: nop,
        onResolve: nop,
        onReject: nop,
        key,
      };
      (asyncSelector as any).curr = newState;
      callState.set(newState, key);
      isLoadingAtom.set(true, key);
      funcAtom.get(key)(vals, key, callId);
    },
  });

  const resultSelector = selector({
    id: `ASYNC_SELECTOR_${id}`,
    inputs: [asyncSelector, valueAtom],
    func: (_, b) => b,
    metadata,
  });

  const [forceUpdate] = createAsyncAction({
    id: `FORCE_UPDATE_${id}`,
    use: { f: forceUpdateAtom, r: resultSelector },
    func: (nodes) => async () => {
      const prev = (asyncSelector as any).curr;
      nodes.f.set(createId());
      nodes.r.get();
      const state = (asyncSelector as any).curr;
      if (prev === state) {
        throw Error('shouldUseAsync() = false');
      }
      return new Promise((res, rej) => {
        state.onResolve = res;
        state.onCancel = rej;
        state.onReject = rej;
      });
    },
  });

  return [resultSelector, isLoadingSelector, errorSelector, forceUpdate];
}
