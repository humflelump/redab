/* eslint-disable jest/no-done-callback */
import { atom, createAction, createAsyncAction } from '..';
import { injectKey } from '..';

const MS = 5;

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
  expect(typeof createAsyncAction).toBe('function');
});

it('has basic functionality', async () => {
  const a = atom(5);

  const [action] = createAsyncAction({
    id: 'basic',
    use: { a },
    func: (nodes) => async (n: number) => {
      nodes.a.set(n);
      return 100;
    },
  });

  const n = await action(10);
  expect(n).toBe(100);
  expect(a.get()).toBe(10);
});

it('returns a loading selector', (done) => {
  const a = atom(5);

  const [action, load] = createAsyncAction({
    id: 'loading',
    use: { a },
    func: (nodes) => async (n: number) => {
      nodes.a.set(n);
      await new Promise((res) => setTimeout(res, 20 * MS));
      return 100;
    },
  });

  expect(load.get()).toBe(false);
  action(10);
  timeout(
    () => {
      expect(a.get()).toBe(10);
      expect(load.get()).toBe(true);
      timeout(
        () => {
          expect(load.get()).toBe(false);
          done();
        },
        20 * MS,
        done
      );
    },
    10 * MS,
    done
  );
});

it('returns an error selector', (done) => {
  const a = atom(5);

  const [action, load, err] = createAsyncAction({
    id: 'loading',
    use: { a },
    func: (nodes) => async (n: number) => {
      nodes.a.set(n);
      await new Promise((res) => setTimeout(res, 20 * MS));
      throw Error('error');
    },
  });

  expect(load.get()).toBe(false);
  action(10).catch((e) => null);
  expect(err.get()).toBe(undefined);
  timeout(
    () => {
      expect(a.get()).toBe(10);
      expect(err.get()).toBe(undefined);
      timeout(
        () => {
          expect(load.get()).toBe(false);
          expect(err.get().message).toBe('error');
          done();
        },
        20 * MS,
        done
      );
    },
    10 * MS,
    done
  );
});

it('can have multiple instances created', (done) => {
  const a = atom({ data: 5, multi: true });
  const b = atom({ data: 10, multi: true });

  const action = createAction({
    id: 'yoyoy',
    use: { b },
    func: (nodes) => (n: number) => {
      nodes.b.set(n);
    },
  });

  const [asyncAction, load] = createAsyncAction({
    id: 'loading',
    use: { a, action },
    multi: true,
    func: (nodes) => async (n: number) => {
      nodes.a.set(n);
      await new Promise((res) => setTimeout(res, 20 * MS));
      nodes.action(n * 2);
    },
  });

  const action1 = injectKey(asyncAction, 'wow');
  const action2 = injectKey(asyncAction, 'test');

  expect(load.get('wow')).toBe(false);
  expect(load.get('test')).toBe(false);
  action1(10);
  action2(20);
  timeout(
    () => {
      expect(a.get('wow')).toBe(10);
      expect(a.get('test')).toBe(20);
      timeout(
        () => {
          expect(b.get('wow')).toBe(20);
          expect(b.get('test')).toBe(40);
          done();
        },
        20 * MS,
        done
      );
    },
    10 * MS,
    done
  );
});

it('calls onCancel once', (done) => {
  const a = atom(5);

  let calls = 0;

  const [asyncAction] = createAsyncAction({
    id: 'cancel',
    use: { a },
    func: (nodes, status) => async (n: number) => {
      status.onCancel = () => {
        calls++;
        expect(status.cancelled).toBe(true);
      };
      nodes.a.set(n);
      await new Promise((res) => setTimeout(res, 10 * MS));
    },
  });

  asyncAction(100);
  expect(calls).toBe(0);
  timeout(
    () => {
      asyncAction(101);
      expect(calls).toBe(0);
      timeout(
        () => {
          asyncAction(102);
          expect(calls).toBe(0);
          timeout(
            () => {
              asyncAction(103);
              timeout(
                () => {
                  expect(calls).toBe(1);
                },
                1 * MS,
                done
              );
            },
            5 * MS,
            done
          );
          done();
        },
        20 * MS,
        done
      );
    },
    20 * MS,
    done
  );
});

it('can handle multiple instances', (done) => {
  const a = atom({ id: 'a', data: 10, multi: true });
  const [action, load] = createAsyncAction({
    id: 'multi',
    use: { a },
    func: (node) => async (n: number, timeout: number) => {
      await new Promise((res) => setTimeout(res, timeout));
      node.a.set(n + 1);
      return n + 100;
    },
    multi: true,
  });

  const action1 = injectKey(action, 'key1');
  const action2 = injectKey(action, 'key2');

  let res1 = null;
  let res2 = null;

  action1(100, 5 * MS).then((n) => {
    res1 = n;
  });
  action2(200, 10 * MS).then((n) => {
    res2 = n;
  });

  timeout(
    () => {
      expect(res1).toBe(null);
      expect(res2).toBe(null);
      expect(a.get('key1')).toBe(10);
      expect(a.get('key2')).toBe(10);
      expect(load.get('key1')).toBe(true);
      expect(load.get('key2')).toBe(true);
      timeout(
        () => {
          expect(res1).toBe(200);
          expect(res2).toBe(null);
          expect(a.get('key1')).toBe(101);
          expect(a.get('key2')).toBe(10);
          expect(load.get('key1')).toBe(false);
          expect(load.get('key2')).toBe(true);
          timeout(
            () => {
              expect(res1).toBe(200);
              expect(res2).toBe(300);
              expect(a.get('key1')).toBe(101);
              expect(a.get('key2')).toBe(201);
              expect(load.get('key1')).toBe(false);
              expect(load.get('key2')).toBe(false);
              done();
            },
            4 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    3 * MS,
    done
  );
});
