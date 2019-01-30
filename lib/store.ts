import { Option } from './';

export class Store<T> {
  private state: T;
  private key: string;
  private option: Option;
  private callbacks: Array<(val: T) => void> = [];

  constructor(state: T, key: string, option: Option = {}) {
    this.state = state;
    this.key = key;
    this.option = option;
  }

  public subscribe = (callback: (val: T) => void) => {
    this.callbacks.push(callback);
  };

  public unsubscribe = (callback: (val: T) => void) => {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  };

  public getState = () => this.state;

  public setState = (newStatePartial: Partial<T>) => {
    this.logByCondition(
      this.option.debug && this.option.debug.beforeUpdate,
      this.state,
    );

    this.state = { ...this.state, ...newStatePartial };
    this.notify(this.state);

    this.logByCondition(
      this.option.debug && this.option.debug.payload,
      newStatePartial,
    );

    this.logByCondition(
      this.option.debug && this.option.debug.afterUpdate,
      this.state,
    );
  };

  /* Private */

  private logByCondition = (
    condition: boolean | undefined,
    data: T | Partial<T>,
  ) => {
    if (condition) {
      console.log(`store ${this.key} was updated`);
      console.log(data);
    }
  };

  private notify = (val: T) => {
    this.callbacks.forEach(cb => {
      cb(val);
    });
  };
}
