import { atom, selector, dynamicSelector } from '../index';
import { isAtom, isDynamicSelector, isSelector } from '../node-types';

it('differentiates between node types', () => {
  const a = atom(0);
  const b = selector({
    inputs: [],
    func: () => null,
  });
  const c = dynamicSelector(() => null);

  expect(isAtom(a)).toBe(true);
  expect(isAtom(b)).toBe(false);
  expect(isAtom(c)).toBe(false);

  expect(isSelector(a)).toBe(false);
  expect(isSelector(b)).toBe(true);
  expect(isSelector(c)).toBe(false);

  expect(isDynamicSelector(a)).toBe(false);
  expect(isDynamicSelector(b)).toBe(false);
  expect(isDynamicSelector(c)).toBe(true);
});
