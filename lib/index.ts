import * as React from 'react';

import { getProvider } from './Provider';
import { getWithConsumer } from './Consumer';
import { Store } from './store';

export interface Option {
  debug?: {
    beforeUpdate?: boolean;
    afterUpdate?: boolean;
    payload?: boolean;
    global?: boolean;
  };
}

export function buildStore<T>(initialVal: T, key: string, option: Option = {}) {
  const store = new Store<T>(initialVal, key, option);
  const context = React.createContext(initialVal);

  if (option.debug && option.debug.global && typeof window) {
    const w = window as any;
    w[key] = store;
    console.log(`store ${key} was created and added to global.`);
  }

  return {
    Provider: getProvider(store, context),
    withConsumer: getWithConsumer(context),
    getState: store.getState,
    setState: store.setState,
  };
}
