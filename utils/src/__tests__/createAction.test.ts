import { injectKey } from '..';
import { createAction, atom } from '..';

it('is exported', () => {
  expect(typeof createAction).toBe('function');
});

it('has basic functionality', () => {
  const a = atom({ data: 1, multi: true });
  const b = atom({ data: 2, multi: true });
  const c = atom({ data: 1, multi: true });
  const d = atom({ data: 2, multi: true });

  const helper = createAction({
    use: { c, d },
    func: (nodes) => (n: number) => {
      nodes.c.set(n);
      nodes.d.set(n);
    },
  });

  const action = createAction({
    use: { a, b, helper },
    func: (nodes) => (n: number) => {
      nodes.a.set(n);
      nodes.b.set(n);
      nodes.helper(n + 1);
      return n * 2;
    },
  });

  expect(action(5)).toBe(10);
  expect(a.get()).toBe(5);
  expect(b.get()).toBe(5);
  expect(c.get()).toBe(6);
  expect(d.get()).toBe(6);

  const action2 = injectKey(action, 'test');
  const action3 = injectKey(action, 'testwow');
  expect(action2(100)).toBe(200);
  expect(a.get('test')).toBe(100);
  expect(b.get('test')).toBe(100);
  expect(c.get('test')).toBe(101);
  expect(d.get('test')).toBe(101);
  expect(action3(1000)).toBe(2000);
  expect(a.get('testwow')).toBe(1000);
  expect(b.get('testwow')).toBe(1000);
  expect(c.get('testwow')).toBe(1001);
  expect(d.get('testwow')).toBe(1001);
  expect(a.get('test')).toBe(100);
  expect(b.get('test')).toBe(100);
  expect(c.get('test')).toBe(101);
  expect(d.get('test')).toBe(101);
});

it('does not trigger subscribers unneccessarily', () => {
  const a = atom({ data: 1 });
  const b = atom({ data: 2 });

  const action1 = createAction({
    use: { a, b },
    func: (nodes) => () => {
      nodes.a.set(5);
      nodes.b.set(5);
    },
  });

  const action2 = createAction({
    use: { a, b, action1 },
    func: (nodes) => () => {
      nodes.action1();
      nodes.a.set(6);
      nodes.b.set(6);
    },
  });

  let calls1 = 0;
  let calls2 = 0;
  const sub1 = () => {
    calls1++;
  };
  const sub2 = () => {
    calls2++;
  };

  a.subscribe(sub1);
  b.subscribe(sub2);

  action2();
  expect(calls1).toBe(1);
  expect(calls2).toBe(1);
  expect(a.get()).toBe(6);
  expect(b.get()).toBe(6);
});

it('can override the provided key', () => {
  const a = atom({ data: 5, multi: true });

  const action = createAction({
    id: 'test',
    use: { a },
    func: (nodes) => (n: number) => {
      nodes.a.set(100, 'key');
      nodes.a.set(n);
    },
  });

  expect(a.get()).toBe(5);
  expect(a.get('key')).toBe(5);
  const action1 = injectKey(action, 'key1');
  action1(20);
  expect(a.get()).toBe(5);
  expect(a.get('key1')).toBe(20);
  expect(a.get('key')).toBe(100);
});
