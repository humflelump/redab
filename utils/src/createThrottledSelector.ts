import { atom } from 'redab-core';
import { selector } from 'redab-core';
import { AtomOrSelector, Selector } from 'redab-core';
import { createAsyncSelector } from './createAsyncSelector';

export function createThrottledSelector<ReturnType>(params: {
  id?: string;
  inputs?: [];
  func: () => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<S1, ReturnType>(params: {
  id?: string;
  inputs: [AtomOrSelector<S1>];
  func: (val1: S1) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<S1, S2, ReturnType>(params: {
  id?: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>];
  func: (val1: S1, val2: S2) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<S1, S2, S3, ReturnType>(params: {
  id?: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>, AtomOrSelector<S3>];
  func: (val1: S1, val2: S2, val3: S3) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<S1, S2, S3, S4, ReturnType>(params: {
  id?: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>
  ];
  func: (val1: S1, val2: S2, val3: S3, val4: S4) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  ReturnType
>(params: {
  id?: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>
  ];
  func: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  ReturnType
>(params: {
  id?: string;
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
    val6: S6
  ) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  ReturnType
>(params: {
  id?: string;
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
    val7: S7
  ) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  ReturnType
>(params: {
  id?: string;
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
    val8: S8
  ) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  ReturnType
>(params: {
  id?: string;
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
    val9: S9
  ) => ReturnType;
  throttle: (f: () => void) => () => void;
}): Selector<ReturnType>;

export function createThrottledSelector(params) {
  const { func, throttle, inputs } = params;
  const id = params.id || '-';

  const cache = atom({
    id: `cache_${id}`,
    data: { ref: {}, res: null },
    multi: true,
  });

  const [asyncSelector] = createAsyncSelector({
    inputs,
    id,
    throttle,
    func: async () => ({}),
    defaultValue: {},
  });

  const returnSelector = selector({
    id: `THROTTLED_SELECTOR_${id}`,
    inputs: [asyncSelector, ...inputs] as any,
    func: (...params: any[]) => {
      const val = params[0];
      const key = params[params.length - 1];
      const outputs = params.slice(1, params.length - 1);
      const cachedValue = cache.get(key);
      if (val !== cachedValue.ref) {
        const result = func(...outputs);
        cache.set({ ref: val, res: result }, key);
        return result;
      }
      return cachedValue.res;
    },
  });
  return returnSelector;
}
