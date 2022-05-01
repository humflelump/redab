/* eslint-disable jest/no-done-callback */
import { atom, createAsyncSelector } from '..';
import { injectKey } from '..';
import { _ } from '../__test_helper/underscore';

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
  expect(typeof createAsyncSelector).toBe('function');
});

it('has basic functionality', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  expect(selector.get()).toBe(10);
  expect(load.get()).toBe(true);
  timeout(
    () => {
      expect(load.get()).toBe(true);
      expect(selector.get()).toBe(10);
      timeout(
        () => {
          expect(load.get()).toBe(false);
          expect(selector.get()).toBe(50);
          done();
        },
        10 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('has basic debounce functionality', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    throttle: (f) => _.debounce(f, 10 * MS),
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n + 1;
    },
    defaultValue: 10,
  });

  timeout(
    () => {
      expect(load.get()).toBe(false);
      expect(selector.get()).toBe(10);
      timeout(
        () => {
          expect(load.get()).toBe(true);
          expect(selector.get()).toBe(10);
          timeout(
            () => {
              expect(load.get()).toBe(false);
              expect(selector.get()).toBe(6);
              done();
            },
            20 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('has basic debounce functionality', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    throttle: (f) => _.debounce(f, 10 * MS),
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n + 1;
    },
    defaultValue: 10,
  });

  timeout(
    () => {
      expect(load.get()).toBe(false);
      expect(selector.get()).toBe(10);
      expect(load.get()).toBe(true);
      timeout(
        () => {
          expect(load.get()).toBe(true);
          expect(selector.get()).toBe(10);
          timeout(
            () => {
              expect(load.get()).toBe(false);
              expect(selector.get()).toBe(6);
              done();
            },
            20 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('has can return an error', (done) => {
  const a = atom(5);

  const e = Error();
  const [selector, _, err] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      throw e;
    },
    defaultValue: 10,
  });

  expect(selector.get()).toBe(10);
  expect(err.get()).toBe(undefined);
  timeout(
    () => {
      expect(selector.get()).toBe(10);
      expect(err.get()).toBe(e);
      done();
    },
    15 * MS,
    done
  );
});

it('memoizes correctly', (done) => {
  const a = atom(5);

  let calls = 0;
  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      calls++;
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  expect(selector.get()).toBe(10);
  expect(selector.get()).toBe(10);
  timeout(
    () => {
      expect(selector.get()).toBe(10);
      expect(load.get()).toBe(true);
      expect(calls).toBe(1);
      timeout(
        () => {
          expect(selector.get()).toBe(50);
          expect(load.get()).toBe(false);
          expect(calls).toBe(1);
          done();
        },
        10 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('handles updated inputs correctly', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  expect(load.get()).toBe(false);
  expect(selector.get()).toBe(10);
  expect(load.get()).toBe(true);
  timeout(
    () => {
      a.update((n) => n + 1);
      expect(selector.get()).toBe(10);
      expect(load.get()).toBe(true);
      timeout(
        () => {
          a.update((n) => n + 1);
          expect(selector.get()).toBe(10);
          expect(load.get()).toBe(true);
          timeout(
            () => {
              a.update((n) => n + 1);
              expect(selector.get()).toBe(10);
              expect(load.get()).toBe(true);
              timeout(
                () => {
                  expect(selector.get()).toBe(80);
                  expect(load.get()).toBe(false);
                  done();
                },
                15 * MS,
                done
              );
            },
            5 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('shouldUseAsync prevents calls', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    shouldUseAsync: (n) => n > 10,
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  expect(load.get()).toBe(false);
  expect(selector.get()).toBe(10);
  expect(load.get()).toBe(false);
  timeout(
    () => {
      a.update((n) => n + 10);
      expect(selector.get()).toBe(10);
      expect(load.get()).toBe(true);
      timeout(
        () => {
          expect(selector.get()).toBe(10);
          expect(load.get()).toBe(true);
          timeout(
            () => {
              expect(selector.get()).toBe(150);
              expect(load.get()).toBe(false);
              done();
            },
            10 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    5 * MS,
    done
  );
});

it('implements forceUpdate which returns a promise', async () => {
  const a = atom(5);

  const [selector, load, err, forceUpdate] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  let n = await forceUpdate();
  expect(n).toBe(50);
  a.set(10);
  n = await forceUpdate();
  expect(n).toBe(100);

  setTimeout(() => {
    forceUpdate();
  }, 5 * MS);
  let errorCount = 0;
  try {
    n = await forceUpdate();
  } catch (e) {
    errorCount++;
  }
  expect(errorCount).toBe(1);
});

it('implements forceUpdate which invalidates the cache', (done) => {
  const a = atom(5);

  const [selector, load, err, forceUpdate] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  expect(selector.get()).toBe(10);
  expect(load.get()).toBe(true);
  timeout(
    () => {
      expect(selector.get()).toBe(50);
      expect(load.get()).toBe(false);
      forceUpdate();
      expect(load.get()).toBe(true);
      expect(selector.get()).toBe(50);
      timeout(
        () => {
          expect(selector.get()).toBe(50);
          expect(load.get()).toBe(false);
          done();
        },
        15 * MS,
        done
      );
    },
    15 * MS,
    done
  );
});

it('has basic functionality with multiple keys', (done) => {
  const a = atom({ data: 5, multi: true });

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, n * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  a.set(5, 'key1');
  a.set(10, 'key2');
  expect(selector.get('key1')).toBe(10);
  expect(selector.get('key2')).toBe(10);
  expect(load.get('key1')).toBe(true);
  expect(load.get('key2')).toBe(true);
  timeout(
    () => {
      expect(selector.get('key1')).toBe(50);
      expect(selector.get('key2')).toBe(10);
      expect(load.get('key1')).toBe(false);
      expect(load.get('key2')).toBe(true);
      timeout(
        () => {
          expect(selector.get('key1')).toBe(50);
          expect(selector.get('key2')).toBe(100);
          expect(load.get('key1')).toBe(false);
          expect(load.get('key2')).toBe(false);
          done();
        },
        5 * MS,
        done
      );
    },
    7.5 * MS,
    done
  );
});

it('handles debounce with multiple keys', (done) => {
  const a = atom({ data: 0, multi: true });

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, n * MS));
      return n * 10;
    },
    throttle: (f) => _.debounce(f, 10 * MS),
    defaultValue: 10,
  });

  a.set(5, 'key1');
  a.set(10, 'key2');
  expect(selector.get('key1')).toBe(10);
  expect(selector.get('key2')).toBe(10);
  expect(load.get('key1')).toBe(true);
  expect(load.get('key2')).toBe(true);
  timeout(
    () => {
      expect(selector.get('key1')).toBe(50);
      expect(selector.get('key2')).toBe(10);
      expect(load.get('key1')).toBe(false);
      expect(load.get('key2')).toBe(true);
      a.set(5, 'key2');
      selector.get('key2');
      timeout(
        () => {
          expect(selector.get('key2')).toBe(10);
          expect(load.get('key2')).toBe(true);
          timeout(
            () => {
              expect(selector.get('key2')).toBe(50);
              expect(load.get('key2')).toBe(false);
              done();
            },
            5 * MS,
            done
          );
        },
        12.5 * MS,
        done
      );
    },
    17.5 * MS,
    done
  );
});

it('handles forceUpdate with multiple keys', (done) => {
  const a = atom({ data: 0, multi: true });

  const [selector, load, err, forceUpdate] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n) => {
      await new Promise((res) => setTimeout(res, n * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  const update1 = injectKey(forceUpdate, 'key1');
  const update2 = injectKey(forceUpdate, 'key2');

  a.set(5, 'key1');
  a.set(10, 'key2');
  update1();
  update2();
  expect(load.get('key1')).toBe(true);
  expect(load.get('key2')).toBe(true);
  timeout(
    () => {
      expect(selector.get('key1')).toBe(50);
      expect(selector.get('key2')).toBe(10);
      expect(load.get('key1')).toBe(false);
      expect(load.get('key2')).toBe(true);
      timeout(
        () => {
          expect(selector.get('key1')).toBe(50);
          expect(selector.get('key2')).toBe(100);
          expect(load.get('key1')).toBe(false);
          expect(load.get('key2')).toBe(false);
          done();
        },
        5 * MS,
        done
      );
    },
    7.5 * MS,
    done
  );
});

it('has action state passed in', (done) => {
  const a = atom({ data: 0, multi: false });
  let count = 0;
  const [selector] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    func: async (n, state) => {
      state.onCancel = () => {
        expect(state.cancelled).toBe(true);
        count++;
      };
      await new Promise((res) => setTimeout(res, n * MS));
      return n * 10;
    },
    defaultValue: 10,
  });

  a.set(1);
  selector.get();
  a.set(2);
  selector.get();
  a.set(3);
  selector.get();
  timeout(
    () => {
      expect(count).toBe(2);
      done();
    },
    2.5 * MS,
    done
  );
});
