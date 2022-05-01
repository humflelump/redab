export type Listener<T = undefined> = {
  (atom: Atom<any>): void;
  data?: T;
};

export type ListenerListener = (
  newListeners: Listener<any>[],
  prevListeners: Listener<any>[],
  key: any
) => void;
export type AtomMiddleware<T> = (
  next: T,
  curr: T,
  atom: Atom<T>,
  key: any
) => T;

export type ParentType = {
  getId: () => string;
  getListeners: (key?: any) => Listener<any>[];
  getDependencies: (key?: any) => AtomOrSelector<any>[];
  getDependants: (key?: any) => AtomOrSelector<any>[];
  subscribe: (l: Listener<any>, key?: any) => void;
  unsubscribe: (l: Listener<any>, key?: any) => void;
  listenersChanged: ListenerListener | null;
  garbageCollect: (key) => void;
  getMetadata: () => any;
};

export type Atom<T> = {
  get: (key?: any) => T;
  update(func: (val: T) => T, key?: any);
  set: (val: T, key?: any) => void;
  setIfShouldNotifyListeners(bool: boolean, key?: any): void;
  shouldNotifyListeners(key?: any): boolean;
  addMiddleware(middleware: AtomMiddleware<T>): void;
  removeMiddleware(middleware: AtomMiddleware<T>): void;
} & ParentType;

export type Selector<T> = {
  get: (key?: any) => T;
} & ParentType;

export type DynamicSelector<T> = {
  get: (key?: any) => T;
} & ParentType;

export type AtomOrSelector<T> = Atom<T> | Selector<T> | DynamicSelector<T>;
