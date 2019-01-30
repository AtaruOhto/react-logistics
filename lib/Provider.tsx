import * as React from 'react';
import { Store } from './store';

export function getProvider<T>(store: Store<T>, context: React.Context<T>) {
  return class Provider extends React.Component<{}, T> {
    constructor(props: {}) {
      super(props);
      this.state = store.getState();
    }

    public componentWillMount() {
      store.subscribe(this.subscribeCounter);
    }

    public componentWillUnmount() {
      store.unsubscribe(this.subscribeCounter);
    }

    public render() {
      return (
        <context.Provider value={this.state}>
          {this.props.children}
        </context.Provider>
      );
    }

    private subscribeCounter = (val: T) => {
      this.setState(val);
    };
  };
}
