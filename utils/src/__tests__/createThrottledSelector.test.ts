import { atom, createThrottledSelector } from '..';
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
  expect(typeof createThrottledSelector).toBe('function');
});

it('has basic functionality', (done) => {
  const a = atom(5);

  let calls = 0;
  const selector = createThrottledSelector({
    id: 'test',
    inputs: [a],
    func: (n) => {
      calls++;
      return 2 * n;
    },
    throttle: (f) => _.debounce(f, 10 * MS),
  });

  expect(selector.get()).toBe(10);
  expect(calls).toBe(1);
  timeout(
    () => {
      a.update((n) => n + 1);
      expect(selector.get()).toBe(10);
      expect(calls).toBe(1);
      timeout(
        () => {
          a.update((n) => n + 1);
          expect(selector.get()).toBe(10);
          expect(calls).toBe(1);
          timeout(
            () => {
              a.update((n) => n + 1);
              expect(selector.get()).toBe(10);
              expect(calls).toBe(1);
              timeout(
                () => {
                  expect(selector.get()).toBe(16);
                  expect(calls).toBe(2);
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

it('throttles', (done) => {
  const a = atom(5);

  let calls = 0;
  const selector = createThrottledSelector({
    id: 'test',
    inputs: [a],
    func: (n) => {
      calls++;
      return 2 * n;
    },
    throttle: (f) => _.throttle(f, 10 * MS),
  });

  a.update((n) => n + 1);
  expect(selector.get()).toBe(12);
  expect(calls).toBe(1);
  timeout(
    () => {
      a.update((n) => n + 1);
      expect(selector.get()).toBe(14);
      expect(calls).toBe(2);
      timeout(
        () => {
          a.update((n) => n + 1);
          expect(selector.get()).toBe(14);
          expect(calls).toBe(2);
          timeout(
            () => {
              expect(selector.get()).toBe(14);
              expect(calls).toBe(2);
              timeout(
                () => {
                  expect(selector.get()).toBe(16);
                  expect(calls).toBe(3);
                  done();
                },
                5 * MS,
                done
              );
            },
            2.5 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    1,
    done
  );
});

it('throttles with multiple keys', (done) => {
  const a = atom({ data: 5, multi: true });

  const selector = createThrottledSelector({
    id: 'test',
    inputs: [a],
    func: (n) => {
      return 2 * n;
    },
    throttle: (f) => _.throttle(f, 10 * MS),
  });

  a.update((n) => n + 1, 'key1');
  expect(selector.get('key1')).toBe(12);
  timeout(
    () => {
      a.update((n) => n + 1, 'key1');
      expect(selector.get('key1')).toBe(14);
      timeout(
        () => {
          a.update((n) => n + 1, 'key1');
          expect(selector.get('key1')).toBe(14);
          timeout(
            () => {
              expect(selector.get('key1')).toBe(14);
              timeout(
                () => {
                  expect(selector.get('key1')).toBe(16);
                  done();
                },
                5 * MS,
                done
              );
            },
            2.5 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    1,
    done
  );

  a.update((n) => n + 1, 'key2');
  expect(selector.get('key2')).toBe(12);
  timeout(
    () => {
      a.update((n) => n + 1, 'key2');
      expect(selector.get('key2')).toBe(14);
      timeout(
        () => {
          a.update((n) => n + 1, 'key2');
          expect(selector.get('key2')).toBe(14);
          timeout(
            () => {
              expect(selector.get('key2')).toBe(14);
              timeout(
                () => {
                  expect(selector.get('key2')).toBe(16);
                  done();
                },
                5 * MS,
                done
              );
            },
            2.5 * MS,
            done
          );
        },
        5 * MS,
        done
      );
    },
    1,
    done
  );
});
