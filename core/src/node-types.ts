import { ATOM_PROTOTYPE } from './atom/construct';
import { DYNAMIC_SELECTOR_PROTOTYPE } from './dynamicSelector/construct';
import { SELECTOR_PROTOTYPE } from './selector/construct';

export function isAtom(obj: any) {
  return obj?.__proto__ === ATOM_PROTOTYPE;
}

export function isSelector(obj: any) {
  return obj?.__proto__ === SELECTOR_PROTOTYPE;
}

export function isDynamicSelector(obj: any) {
  return obj?.__proto__ === DYNAMIC_SELECTOR_PROTOTYPE;
}
