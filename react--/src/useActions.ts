import React from "react";
import { AnyFunction, Atom, isAction } from "redab-utils";
import { useCurrentKey } from "./useCurrentKey";

type Action<T extends AnyFunction> = T & { construct: any };
type AtomReturnType<T> = T extends Atom<infer Return> ? Return : unknown;
type ActionReturnType<T> = T extends Action<infer Return> ? Return : unknown;
type AtomUpdateType<T> = T | ((val: T) => T);

export function useActions(): [];

export function useActions<T1 extends Atom<any> | Action<any>>(
  d1: T1
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>,
  T5 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4,
  d5: T5
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>,
  T5 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T5>>) => void
    : ActionReturnType<T5>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>,
  T5 extends Atom<any> | Action<any>,
  T6 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4,
  d5: T5,
  d6: T6
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>,
  T5 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T5>>) => void
    : ActionReturnType<T5>,
  T6 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T6>>) => void
    : ActionReturnType<T6>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>,
  T5 extends Atom<any> | Action<any>,
  T6 extends Atom<any> | Action<any>,
  T7 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4,
  d5: T5,
  d6: T6,
  d7: T7
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>,
  T5 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T5>>) => void
    : ActionReturnType<T5>,
  T6 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T6>>) => void
    : ActionReturnType<T6>,
  T7 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T7>>) => void
    : ActionReturnType<T7>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>,
  T5 extends Atom<any> | Action<any>,
  T6 extends Atom<any> | Action<any>,
  T7 extends Atom<any> | Action<any>,
  T8 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4,
  d5: T5,
  d6: T6,
  d7: T7,
  d8: T8
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>,
  T5 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T5>>) => void
    : ActionReturnType<T5>,
  T6 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T6>>) => void
    : ActionReturnType<T6>,
  T7 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T7>>) => void
    : ActionReturnType<T7>,
  T8 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T8>>) => void
    : ActionReturnType<T8>
];

export function useActions<
  T1 extends Atom<any> | Action<any>,
  T2 extends Atom<any> | Action<any>,
  T3 extends Atom<any> | Action<any>,
  T4 extends Atom<any> | Action<any>,
  T5 extends Atom<any> | Action<any>,
  T6 extends Atom<any> | Action<any>,
  T7 extends Atom<any> | Action<any>,
  T8 extends Atom<any> | Action<any>,
  T9 extends Atom<any> | Action<any>
>(
  d1: T1,
  d2: T2,
  d3: T3,
  d4: T4,
  d5: T5,
  d6: T6,
  d7: T7,
  d8: T8,
  d9: T9
): [
  T1 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T1>>) => void
    : ActionReturnType<T1>,
  T2 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T2>>) => void
    : ActionReturnType<T2>,
  T3 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T3>>) => void
    : ActionReturnType<T3>,
  T4 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T4>>) => void
    : ActionReturnType<T4>,
  T5 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T5>>) => void
    : ActionReturnType<T5>,
  T6 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T6>>) => void
    : ActionReturnType<T6>,
  T7 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T7>>) => void
    : ActionReturnType<T7>,
  T8 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T8>>) => void
    : ActionReturnType<T8>,
  T9 extends Atom<any>
    ? (x: AtomUpdateType<AtomReturnType<T9>>) => void
    : ActionReturnType<T9>
];

export function useActions(...list: any) {
  const key = useCurrentKey();
  const result: any = React.useMemo(() => {
    return list.map((node) => {
      if (isAction(node)) {
        return node.construct(key);
      } else {
        return (d) =>
          typeof d === "function" ? node.update(d, key) : node.set(d, key);
      }
    });
  }, [key]);
  return result;
}
