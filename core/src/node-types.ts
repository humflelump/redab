import { ATOM_PROTOTYPE } from './Atom';
import { DYNAMIC_SELECTOR_PROTOTYPE } from './DynamicSelector';
import { SELECTOR_PROTOTYPE } from './Selector';

export function isAtom(obj: any) {
  return obj?.__proto__ === ATOM_PROTOTYPE;
}

export function isSelector(obj: any) {
  return obj?.__proto__ === SELECTOR_PROTOTYPE;
}

export function isDynamicSelector(obj: any) {
  return obj?.__proto__ === DYNAMIC_SELECTOR_PROTOTYPE;
}
