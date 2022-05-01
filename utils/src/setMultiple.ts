import { Atom } from 'redab-core';

export function setMultiple(atoms: [], vals: [], key?: any): void;

export function setMultiple<T1>(atoms: [Atom<T1>], vals: [T1], key?: any): void;

export function setMultiple<T1, T2>(
  atoms: [Atom<T1>, Atom<T2>],
  vals: [T1, T2],
  key?: any
): void;

export function setMultiple<T1, T2, T3>(
  atoms: [Atom<T1>, Atom<T2>, Atom<T3>],
  vals: [T1, T2, T3],
  key?: any
): void;

export function setMultiple<T1, T2, T3, T4>(
  atoms: [Atom<T1>, Atom<T2>, Atom<T3>, Atom<T4>],
  vals: [T1, T2, T3, T4],
  key?: any
): void;

export function setMultiple<T1, T2, T3, T4, T5>(
  atoms: [Atom<T1>, Atom<T2>, Atom<T3>, Atom<T4>, Atom<T5>],
  vals: [T1, T2, T3, T4, T5],
  key?: any
): void;

export function setMultiple<T1, T2, T3, T4, T5, T6>(
  atoms: [Atom<T1>, Atom<T2>, Atom<T3>, Atom<T4>, Atom<T5>, Atom<T6>],
  vals: [T1, T2, T3, T4, T5, T6],
  key?: any
): void;

export function setMultiple(atoms: any[], vals: any[], key?: any) {
  for (let i = 0; i < atoms.length; i++) {
    const prev = atoms[i].shouldNotifyListeners(key);
    atoms[i].setIfShouldNotifyListeners(false, key);
    atoms[i].set(vals[i], key);
    atoms[i].setIfShouldNotifyListeners(prev, key);
  }
  const set = new Set();
  atoms.forEach((atom) => {
    atom.getListeners(key).forEach((listener) => {
      if (!set.has(listener)) {
        listener();
        set.add(listener);
      }
    });
  });
}
