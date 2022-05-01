import { Atom } from "redab-utils";
import { useCurrentKey } from ".";

export const useSyncAtom = <T>(atom: Atom<T>, val: T) => {
  const key = useCurrentKey();
  atom.set(val, key);
};
