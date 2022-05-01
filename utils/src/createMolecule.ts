import { atom } from 'redab-core';
import { DEFAULT_STORE, IStore } from 'redab-core';
import { mapValues } from './helpers/map-values';
import { Atomify } from './types';

export function createMolecule<Slice>(params: {
  slice: Slice;
  key: string;
  multi?: boolean;
  store?: IStore;
}): Atomify<Slice>;

export function createMolecule(params: any) {
  const { key, slice, multi } = params;
  return mapValues(slice, (val, k) => {
    const obj: any = {
      id: `${key}.${k}`,
      store: params.store || DEFAULT_STORE,
      metadata: { molecule: key },
      multi,
      data: val,
    };
    return atom(obj);
  });
}
