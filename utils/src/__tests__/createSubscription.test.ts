import { atom, createSubscription } from '..';

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
  expect(typeof createSubscription).toBe('function');
});

it('has core functionality', (done) => {
  const a = atom(5);

  let counterAtom = atom(0);

  let [c1, c2, c3, c4] = [null, null, null, null];

  const sub = createSubscription({
    id: 'sub',
    defaultValue: 0,
    inputs: [a],
    onSubscribe: (vals, setter) => {
      c3 = [vals];
      const interval = setInterval(() => {
        counterAtom.update((n) => n + 1);
      }, 5 * MS);
      return {
        onUnsubscribe: (vals) => {
          c4 = [vals];
          clearInterval(interval);
        },
        onInputsChanged: (curr, prev) => {
          c1 = [curr, prev];
        },
        onSubscriptionsChanged: (curr, prev) => {
          c2 = [curr, prev];
        },
      };
    },
  });
  expect(c1).toEqual(null);
  expect(c2).toEqual(null);
  expect(c3).toEqual(null);
  expect(c4).toEqual(null);

  let calls = 0;
  const subscription = () => {
    calls++;
  };
  sub.subscribe(subscription);
  expect(c1).toEqual(null);
  expect(c2).toEqual([[subscription], []]);
  expect(c3).toEqual([[5]]);
  expect(c4).toEqual(null);

  a.set(6);
  expect(sub.get()).toBe(0);
  expect(calls).toBe(1);
  expect(c1).toEqual([[6], null]);

  timeout(
    () => {
      sub.unsubscribe(subscription);
      expect(c1).toEqual([[6], null]);
      expect(c2).toEqual([[], [subscription]]);
      expect(c3).toEqual([[5]]);
      expect(c4).toEqual([[6]]);
      expect(counterAtom.get()).toBe(2);
      timeout(
        () => {
          expect(counterAtom.get()).toBe(2);
          done();
        },
        12.5 * MS,
        done
      );
      done();
    },
    12.5 * MS,
    done
  );
});

it('handles multiple keys', (done) => {
  const a = atom(5);

  const sub = createSubscription({
    id: 'sub2',
    defaultValue: 0,
    inputs: [a],
    onSubscribe: (inputs, setter) => {
      const interval = setInterval(() => {
        setter((n) => n + 1);
      }, 5 * MS);
      return {
        onUnsubscribe: (vals) => {
          clearInterval(interval);
        },
      };
    },
  });

  expect(sub.get('key1')).toBe(0);
  expect(sub.get('key2')).toBe(0);
  const sub1 = () => 0;
  const sub2 = () => 0;
  sub.subscribe(sub1, 'key1');
  sub.subscribe(sub2, 'key2');
  timeout(
    () => {
      expect(sub.get('key1')).toBe(0);
      expect(sub.get('key2')).toBe(0);
      timeout(
        () => {
          expect(sub.get('key1')).toBe(1);
          expect(sub.get('key2')).toBe(1);
          timeout(
            () => {
              expect(sub.get('key1')).toBe(2);
              expect(sub.get('key2')).toBe(2);
              sub.unsubscribe(sub1, 'key1');
              sub.unsubscribe(sub2, 'key2');
              timeout(
                () => {
                  expect(sub.get('key1')).toBe(2);
                  expect(sub.get('key2')).toBe(2);
                  done();
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
    },
    2.5 * MS,
    done
  );
});
