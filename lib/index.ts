import * as React from 'react';

import { getProvider } from './Provider';
import { getWithConsumer } from './Consumer';
import { Store } from './store';

export interface Option {
  exposeGlobal?: boolean;
  saveHistory?: boolean;
}

export function buildStore<T>(initialVal: T, key: string, option: Option = {}) {
  const store = new Store<T>(initialVal, option);
  const context = React.createContext(initialVal);

  if (option.exposeGlobal && typeof window) {
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
