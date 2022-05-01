/* eslint-disable jest/no-done-callback */
import { atom, DEFAULT_STORE, Store } from '..';

const MS = 3;

const timeout = (f, ms, done) => {
  setTimeout(() => {
    try {
      f();
    } catch (e) {
      done(e);
    }
  }, ms);
};

it('is exported', () => {
  expect(typeof Store).toBe('function');
});

it('is has a default store', () => {
  expect(typeof DEFAULT_STORE).toBe('object');
});

it('can add and remove middleare on atoms', () => {
  const store = new Store();
  const a = atom({
    data: 1,
    store,
    id: 'a',
    multi: true,
  });

  let res = null;
  const middleware = (next, curr, atom, key) => {
    res = { next, curr, atomId: atom.id, key };
    return next;
  };
  store.addMiddleware(middleware);

  a.set(5);
  expect(res).toEqual({ next: 5, curr: 1, atomId: 'a', key: undefined });
  a.set(5, 'key1');
  expect(res).toEqual({ next: 5, curr: 1, atomId: 'a', key: 'key1' });
  a.set(1, 'key1');
  expect(res).toEqual({ next: 1, curr: 5, atomId: 'a', key: 'key1' });
  a.set(1, 'key1');
  expect(res).toEqual({ next: 1, curr: 1, atomId: 'a', key: 'key1' });

  res = null;
  store.removeMiddleware(middleware);
  a.set(100);
  expect(res).toEqual(null);
});
