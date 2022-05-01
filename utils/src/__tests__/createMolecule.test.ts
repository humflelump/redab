import { createMolecule } from '..';

it('is exported', () => {
  expect(typeof createMolecule).toBe('function');
});

it('has basic functionality', () => {
  const mol = createMolecule({
    key: 'slice',
    slice: {
      a: 1,
      b: 2,
      c: 3,
    },
  });
  expect(mol.a.get()).toBe(1);
  expect(mol.b.get()).toBe(2);
  expect(mol.c.get()).toBe(3);
  mol.b.set(5);
  expect(mol.b.get()).toBe(5);
});

it('has accessor functions', () => {
  const mol = createMolecule({
    multi: true,
    key: 'slice',
    slice: {
      a: (key: number) => key + 1,
      b: () => Number(2),
      c: 3,
      f: () => () => 100,
    },
  });
  expect(mol.f.get()()).toBe(100);
  expect(mol.a.get(1)).toBe(2);
  expect(mol.b.get()).toBe(2);
  expect(mol.c.get()).toBe(3);
  mol.b.set(5);
  expect(mol.b.get()).toBe(5);
  mol.a.set(101, 1);
  expect(mol.a.get(1)).toBe(101);
});
