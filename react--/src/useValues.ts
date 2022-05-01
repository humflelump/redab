import { useCurrentKey } from "./useCurrentKey";
import React from "react";
import { arraysDiff } from "./helpers/arrays-diff";
import { AtomOrSelector } from ".";

export function useValues(): [];

export function useValues<T1>(d1: AtomOrSelector<T1>): [T1];

export function useValues<T1, T2>(
  d1: AtomOrSelector<T1>,
  d2: AtomOrSelector<T2>
): [T1, T2];

export function useValues<T1, T2, T3>(
  d1: AtomOrSelector<T1>,
  d2: AtomOrSelector<T2>,
  d3: AtomOrSelector<T3>
): [T1, T2, T3];

export function useValues<T1, T2, T3, T4>(
  d1: AtomOrSelector<T1>,
  d2: AtomOrSelector<T2>,
  d3: AtomOrSelector<T3>,
  d4: AtomOrSelector<T4>
): [T1, T2, T3, T4];

export function useValues(...selectors: any) {
  const key = useCurrentKey();
  const vals = selectors.map((d) => d.get(key));
  const [outputs, setValue] = React.useState(vals);

  React.useEffect(() => {
    let prev = outputs;
    const listener = () => {
      const newVals = selectors.map((d) => d.get(key));
      if (arraysDiff(prev, newVals)) {
        setValue(newVals);
        prev = newVals;
      }
    };
    selectors.forEach((s) => s.subscribe(listener, key));
    return () => {
      selectors.forEach((s) => s.unsubscribe(listener, key));
    };
  }, []);

  return outputs as any;
}
