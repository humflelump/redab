import { atom, selector, dynamicSelector } from '../index';

it('is exported', () => {
  expect(typeof atom).toBe('function');
});

it('has basic get and set functionality', () => {
  const a = atom({
    id: 'id',
    data: 5,
  });

  expect(a.get()).toBe(5);
  a.set(42);
  expect(a.get()).toBe(42);
});

it('has basic get and set functionality with multiple keys', () => {
  const a = atom({
    multi: true,
    id: 'id',
    data: 5,
  });

  expect(a.get('a')).toBe(5);
  expect(a.get('b')).toBe(5);
  a.set(42, 'a');
  expect(a.get('a')).toBe(42);
  a.set(420, 'b');
  expect(a.get('b')).toBe(420);
});

it('can be initialized with a function', () => {
  const a = atom({
    id: 'id',
    data: (n) => n + 1,
    multi: true,
  });

  expect(a.get(1)).toBe(2);
  expect(a.get(2)).toBe(3);
});

it('has basic get and update functionality', () => {
  const a = atom({
    id: 'id',
    data: 5,
  });

  expect(a.get()).toBe(5);
  a.update((n) => n + 37);
  expect(a.get()).toBe(42);
});

it('works when just passing in value', () => {
  const a = atom(5);

  expect(a.get()).toBe(5);
  a.set(42);
  expect(a.get()).toBe(42);
});

it('can contain metadata', () => {
  const a = atom({
    data: 8,
    metadata: 'hi',
  });

  expect(a.getMetadata()).toBe('hi');
});

it('has middleware that works as expected', () => {
  let data = null;

  const a = atom({
    data: 100,
    middleware: [
      (val, prev, atom) => {
        data = [val, prev, atom];
        return val + 1;
      },
      (val, prev, atom) => {
        data = [val, prev, atom];
        return val + 1;
      },
    ],
  });

  a.set(6);
  expect(data[0]).toBe(7);
  expect(data[1]).toBe(100);
  expect(data[2]).toBe(a);
  expect(a.get()).toBe(8);
});

it('can set and get id', () => {
  const a = atom({ data: 5, id: 'hi' });
  expect(a.getId()).toBe('hi');
});

it('has correct default id', () => {
  const a = atom(5);
  const b = atom({ data: 5 });
  expect(a.getId()).toBe('-');
  expect(b.getId()).toBe('-');
});

it('has the ability to be subscribed to and unsubscribed from', () => {
  let data1 = 0;
  let data2 = 0;
  const a = atom(5);
  const f1 = () => {
    data1 += 1;
  };
  const f2 = () => {
    data2 += 1;
  };
  a.subscribe(f1);
  expect(data1).toBe(0);
  expect(data2).toBe(0);
  a.set(6);
  expect(data1).toBe(1);
  expect(data2).toBe(0);
  a.subscribe(f2);
  a.set(5);
  expect(data1).toBe(2);
  expect(data2).toBe(1);

  a.unsubscribe(f1);
  a.set(6);
  expect(data1).toBe(2);
  expect(data2).toBe(2);
});

it('has subscriptions which only update on change', () => {
  let data = 0;
  const a = atom({ data: 5, multi: true });
  const f = () => {
    data += 1;
  };

  a.subscribe(f, '-');
  expect(data).toBe(0);
  a.set(6, '-');
  expect(data).toBe(1);
  a.set(6, '-');
  expect(data).toBe(1);
});

it('will only notify subscriptions when notifyListeners is true', () => {
  let data = 0;
  const a = atom(5);
  const f = () => {
    data += 1;
  };

  a.subscribe(f);
  expect(data).toBe(0);
  a.set(6);
  expect(data).toBe(1);
  a.setIfShouldNotifyListeners(false);
  a.set(7);
  expect(data).toBe(1);
  a.setIfShouldNotifyListeners(true);
  a.set(7);
  expect(data).toBe(1);
  a.set(8);
  expect(data).toBe(2);
});

it('will notify when subscriptions are added or removed', () => {
  let data = { next: null, prev: null };
  const a = atom({
    data: 5,
    listenersChanged: (next, prev) => {
      data = { next, prev };
    },
  });
  const s = selector({
    inputs: [a],
    func: (val) => val + 1,
  });
  const f = () => null;

  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  a.subscribe(f);
  expect(data.prev.length).toBe(0);
  expect(data.next[0]).toBe(f);

  // nothing should happen
  a.subscribe(f);
  expect(data.prev.length).toBe(0);
  expect(data.next[0]).toBe(f);

  s.subscribe(f);
  expect(data.prev.length).toBe(0);
  expect(data.next[0]).toBe(f);

  a.unsubscribe(f);
  expect(data.prev.length).toBe(0);
  expect(data.next[0]).toBe(f);

  a.unsubscribe(f);
  expect(data.prev.length).toBe(0);
  expect(data.next[0]).toBe(f);

  s.unsubscribe(f);
  expect(data.prev.length).toBe(1);
  expect(data.next.length).toBe(0);
});

it('will notify when subscriptions are added or removed by dynamic selectors', () => {
  let data = { next: null, prev: null };
  const a = atom({
    data: 5,
    id: 'wow aaa',
    listenersChanged: (next, prev) => {
      data = { next, prev };
    },
  });
  const b = atom({ data: false, id: 'wow b' });
  const s = dynamicSelector({
    id: 'wow s',
    func: (get) => {
      if (get(b)) {
        return get(a) + 1;
      } else {
        return 42;
      }
    },
  });
  const f = () => null;

  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  s.subscribe(f);
  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  s.get();
  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  a.set(6);
  s.get();
  expect(data.next).toBe(null);
  expect(data.prev).toBe(null);
  b.set(true);
  expect(data.next).toEqual([f]);
  expect(data.prev).toEqual([]);
  s.get();
  expect(data.next).toEqual([f]);
  expect(data.prev).toEqual([]);
  b.set(false);
  expect(data.next).toEqual([]);
  expect(data.prev).toEqual([f]);
  s.get();
  expect(data.next).toEqual([]);
  expect(data.prev).toEqual([f]);
});

it('will return an empty list from the getDependencies() method', () => {
  const a = atom(5);
  const b = atom({ data: 10, multi: true });
  expect(a.getDependencies()).toEqual([]);
  expect(b.getDependencies()).toEqual([]);
  expect(a.getDependencies('key')).toEqual([]);
  expect(b.getDependencies('key')).toEqual([]);
});

it('will return selectors as dependents', () => {
  const a = atom(5);
  expect(a.getDependants()).toEqual([]);
  const b = selector({
    id: 'b',
    inputs: [a],
    func: (val) => {
      return val + 1;
    },
  });
  expect(a.getDependants().length).toBe(1);
  expect(a.getDependants()[0]).toBe(b);
  const c = selector({
    id: 'c',
    inputs: [a],
    func: (val) => {
      return val + 1;
    },
  });
  c.get();
  expect(a.getDependants().length).toBe(2);
});

it('will return dynamic selectors as dependents', () => {
  const a = atom(5);
  const b = atom(6);
  const c = atom(true);
  const sel = dynamicSelector({
    id: 'dyn',
    func: (get) => {
      if (get(c) === true) {
        return get(a) + 1;
      } else {
        return get(b) + 1;
      }
    },
  });
  expect(a.getDependants().length).toBe(0);
  sel.get();
  expect(a.getDependants()[0]).toBe(sel);
  expect(b.getDependants()[0]).toBe(undefined);
  expect(c.getDependants()[0]).toBe(sel);
  c.set(false);
  expect(a.getDependants()[0]).toBe(undefined);
  expect(b.getDependants()[0]).toBe(sel);
  expect(c.getDependants()[0]).toBe(sel);
  sel.get();
  expect(a.getDependants()[0]).toBe(undefined);
  expect(b.getDependants()[0]).toBe(sel);
  expect(c.getDependants()[0]).toBe(sel);
});

it('can store multiple values or not', () => {
  const a = atom({ data: 5, multi: true });
  const b = atom({ data: 5, multi: false });
  a.set(100, '1');
  a.set(200, '2');
  b.set(100, '1');
  b.set(200, '2');
  expect(a.get('1')).toBe(100);
  expect(a.get('2')).toBe(200);
  expect(b.get('1')).toBe(200);
  expect(b.get('2')).toBe(200);
  expect(b.get()).toBe(200);
});

it('can have subscriptions based on key', () => {
  const a = atom({ data: 5, multi: true });
  const b = atom({ data: 5, multi: false });

  let calls1 = 0;
  let calls2 = 0;

  const f1 = () => {
    calls1++;
  };

  const f2 = () => {
    calls2++;
  };

  a.subscribe(f1, 'key1');
  a.subscribe(f2, 'key2');
  a.set(1, 'key1');
  a.set(1, 'key2');
  expect(calls1).toBe(1);
  expect(calls2).toBe(1);

  b.subscribe(f1, 'key1');
  b.subscribe(f2, 'key2');
  b.set(1);
  expect(calls1).toBe(2);
  expect(calls2).toBe(2);
  b.set(1, 'key1');
  expect(calls1).toBe(2);
  expect(calls2).toBe(2);
  b.set(2, 'key1');
  expect(calls1).toBe(3);
  expect(calls2).toBe(3);
});
