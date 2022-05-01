import { atom, selector } from '../index';

it('is exported', () => {
  expect(typeof selector).toBe('function');
});

it('has basic get functionality', () => {
  const s = selector({
    id: 's',
    func: () => 5,
  });
  expect(s.get()).toBe(5);
  expect(s.get()).toBe(5);
});

it('can contain metadata', () => {
  const a = selector({
    id: '8',
    metadata: 'yo',
    func: () => null,
  });

  expect(a.getMetadata()).toBe('yo');
});

it('has basic memoization functionality', () => {
  let calls = 0;
  const s = selector({
    id: 's',
    func: () => {
      calls++;
      return 1;
    },
  });
  expect(calls).toBe(0);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
});

it('has more complex memoization functionality', () => {
  let calls1 = 0;
  let calls2 = 0;
  const a = atom(5);
  const b = atom(6);
  const s1 = selector({
    inputs: [a, b],
    func: (a, b) => {
      calls1++;
      return a + b;
    },
  });
  const s2 = selector({
    inputs: [s1],
    func: (n) => {
      calls2++;
      return n * 2;
    },
  });
  expect(calls1).toBe(0);
  expect(calls2).toBe(0);
  b.set(5);
  b.set(6);
  expect(calls1).toBe(0);
  expect(calls2).toBe(0);
  expect(s1.get()).toBe(11);
  expect(calls1).toBe(1);
  expect(calls2).toBe(0);
  expect(s1.get()).toBe(11);
  expect(calls1).toBe(1);
  expect(calls2).toBe(0);
  expect(s2.get()).toBe(22);
  expect(calls1).toBe(1);
  expect(calls2).toBe(1);
  a.set(10);
  b.set(11);
  expect(s2.get()).toBe(42);
  expect(calls1).toBe(2);
  expect(calls2).toBe(2);
  a.set(11);
  b.set(10);
  expect(s2.get()).toBe(42);
  expect(calls1).toBe(3);
  expect(calls2).toBe(2);
});

it('has an id that can be retrieved', () => {
  const s = selector({
    id: 'hi',
    func: () => null,
  });
  expect(s.getId()).toBe('hi');
});

it('has a default id', () => {
  const s = selector({
    func: () => null,
  });
  expect(s.getId()).toBe('-');
});

it('has dependencies that can be read', () => {
  const a = atom(1);
  const b = atom(2);
  const c = selector({
    inputs: [a, b],
    func: () => null,
  });
  const s = selector({
    inputs: [b, c],
    func: () => null,
  });
  s.subscribe(() => null);
  expect(s.getDependencies().includes(a)).toBe(false);
  expect(s.getDependencies().includes(b)).toBe(true);
  expect(s.getDependencies().includes(c)).toBe(true);
  expect(c.getDependencies().includes(a)).toBe(true);
  expect(c.getDependencies().includes(b)).toBe(true);
  expect(c.getDependencies().includes(c)).toBe(false);
});

it('has dependendents that can be read', () => {
  const a = atom(1);
  const b = atom(2);
  const c = selector({
    inputs: [a, b],
    func: () => null,
  });
  const d = selector({
    inputs: [b, c],
    func: () => null,
  });
  const e = selector({
    inputs: [d],
    func: () => null,
  });
  e.subscribe(() => null);
  expect(e.getDependants()).toEqual([]);
  expect(d.getDependants().length).toBe(1);
  expect(d.getDependants().includes(e)).toBe(true);
  expect(c.getDependants().length).toBe(1);
  expect(c.getDependants().includes(d)).toBe(true);
});

it('can be subscribed to and unsubscribed from', () => {
  const a = atom(1);
  const b = atom(2);
  const c = selector({
    inputs: [],
    func: () => null,
  });
  const d = selector({
    inputs: [b, c],
    func: () => null,
  });
  const e = selector({
    inputs: [d],
    func: () => null,
  });
  let calls = 0;
  const f = () => {
    calls++;
  };
  e.subscribe(f);

  expect(calls).toBe(0);
  b.set(3);
  expect(calls).toBe(1);
  b.set(3);
  expect(calls).toBe(1);
  a.set(3);
  expect(calls).toBe(1);
  b.set(4);
  expect(calls).toBe(2);

  e.unsubscribe(f);
  expect(calls).toBe(2);
  b.set(0);
  expect(calls).toBe(2);
});

it('has the ability to subscribe to subscription events', () => {
  let data = { next: null, prev: null };
  const b = atom(2);
  const c = selector({
    inputs: [],
    func: () => null,
  });
  const d = selector({
    inputs: [b, c],
    func: () => null,
    listenersChanged: (next, prev) => {
      data = { next, prev };
    },
  });
  const e = selector({
    inputs: [d],
    func: () => null,
  });
  const f1 = () => null;
  const f2 = () => null;
  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  e.subscribe(f1);
  expect(data.next[0]).toBe(f1);
  expect(data.prev[0]).toBe(undefined);
  d.subscribe(f1);
  expect(data.next[0]).toBe(f1);
  expect(data.prev[0]).toBe(undefined);
  e.unsubscribe(f1);
  expect(data.next[0]).toBe(f1);
  expect(data.prev[0]).toBe(undefined);
  d.unsubscribe(f1);
  expect(data.next[0]).toBe(undefined);
  expect(data.prev[0]).toBe(f1);

  e.subscribe(f1);
  expect(data.next[0]).toBe(f1);
  expect(data.prev[0]).toBe(undefined);
  e.subscribe(f2);
  expect(data.next.length).toBe(2);
  expect(data.prev.length).toBe(1);
  e.subscribe(f1);
  expect(data.next.length).toBe(2);
  expect(data.prev.length).toBe(1);
  e.unsubscribe(f1);
  expect(data.next.length).toBe(2);
  expect(data.prev.length).toBe(1);
  e.unsubscribe(f1);
  expect(data.next.length).toBe(1);
  expect(data.prev.length).toBe(2);
  e.unsubscribe(f2);
  expect(data.next.length).toBe(0);
  expect(data.prev.length).toBe(1);
});

it('can calculate use both atom types', () => {
  const a = atom({ data: 100, multi: true });
  const b = atom({ data: 200, multi: false });
  let calls = 0;
  const s = selector({
    id: 'test',
    inputs: [a, b],
    func: (a, b) => {
      calls++;
      return a + b;
    },
  });
  expect(calls).toBe(0);
  expect(s.get('1')).toBe(300);
  expect(calls).toBe(1);
  expect(s.get('1')).toBe(300);
  expect(calls).toBe(1);

  a.set(300, '2');
  expect(s.get('1')).toBe(300);
  expect(calls).toBe(1);
  expect(s.get('2')).toBe(500);
  expect(calls).toBe(2);

  b.set(400, '3');
  expect(s.get('1')).toBe(500);
  expect(calls).toBe(3);
});

it('can maintain complex dependencies', () => {
  let d = { next: null, prev: null, key: null };
  const a = atom({
    id: 'a',
    data: 100,
    multi: true,
    listenersChanged: (next, prev, key) => {
      d = { next, prev, key };
    },
  });
  const b = atom({ id: 'b', data: 10, multi: false });

  let calls1 = 0;
  const s1 = selector({
    id: 's1',
    inputs: [a],
    func: (a) => {
      calls1++;
      return a * 10;
    },
  });

  let calls2 = 0;
  const s2 = selector({
    id: 's2',
    inputs: [s1],
    func: (a) => {
      calls2++;
      return a + 10;
    },
  });

  let calls3 = 0;
  const s3 = selector({
    id: 's2',
    inputs: [s2, b],
    func: (x, y) => {
      calls3++;
      return x + y;
    },
  });

  expect(s1.get('key1')).toBe(1000);
  expect(calls1).toBe(1);
  expect(s1.get('key1')).toBe(1000);
  expect(calls1).toBe(1);
  expect(s1.get('key2')).toBe(1000);
  expect(calls1).toBe(2);

  let subhits = 0;
  const f1 = () => {
    subhits++;
  };
  const f2 = () => {
    subhits++;
  };

  expect(d).toEqual({ next: null, prev: null, key: null });
  s3.subscribe(f1, 'key1');
  expect(d).toEqual({ next: [f1], prev: [], key: 'key1' });
  s3.subscribe(f2, 'key2');
  expect(d).toEqual({ next: [f2], prev: [], key: 'key2' });
  expect(subhits).toBe(0);
  a.set(10, 'key3');
  expect(subhits).toBe(0);
  a.set(10, 'key2');
  expect(subhits).toBe(1);
  a.set(10, 'key1');
  expect(subhits).toBe(2);

  b.set(11);
  expect(subhits).toBe(4);

  s3.unsubscribe(f1, 'key1');
  expect(d).toEqual({ next: [], prev: [f1], key: 'key1' });
  s3.unsubscribe(f2, 'key2');
  expect(d).toEqual({ next: [], prev: [f2], key: 'key2' });

  expect(s3.get('key1')).toBe(121);
  expect(calls1).toBe(3);
  expect(calls2).toBe(1);
  expect(calls3).toBe(1);

  expect(s3.get('key1')).toBe(121);
  expect(calls1).toBe(3);
  expect(calls2).toBe(1);
  expect(calls3).toBe(1);

  expect(s3.get('key4')).toBe(1021);
  expect(calls1).toBe(4);
  expect(calls2).toBe(2);
  expect(calls3).toBe(2);

  expect(s2.get('key4')).toBe(1010);
  expect(calls1).toBe(4);
  expect(calls2).toBe(2);
  expect(calls3).toBe(2);

  b.set(15);

  expect(s3.get('key4')).toBe(1025);
  expect(calls1).toBe(4);
  expect(calls2).toBe(2);
  expect(calls3).toBe(3);
});
