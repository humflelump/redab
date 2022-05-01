import { Atom } from 'redab-core';

export type AnyFunction = (...p: any[]) => any;

export type Action<T extends AnyFunction> = T & { construct: any };

export type Setter<Input> = (val: Input) => void;

export type AsyncSelectorPromiseState<T> = {
  callId: string;
  cancelled: boolean;
  onCancel: () => void;
  onReject: () => Error;
  onResolve: () => T;
  key: any;
};

export type AsyncActionState = {
  id: string;
  cancelled: boolean;
  onCancel: () => void;
};

export type Atomify<Object> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof Object]: Object[P] extends AnyFunction
    ? Atom<ReturnType<Object[P]>>
    : Atom<Object[P]>;
};
