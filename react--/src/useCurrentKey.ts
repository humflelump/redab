import React from 'react';
import { CurrentKeyContext } from './constants';

export function useCurrentKey() {
  return React.useContext(CurrentKeyContext);
}
