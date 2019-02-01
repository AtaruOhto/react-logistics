import { Option } from './';

export class Store<T> {
  private state: T;
  private option: Option;
  private callbacks: Array<(val: T) => void> = [];
  private payloadHistory: Partial<T>[] = [];
  private timeMachineCursor: number = 0;
  private debugPayload: boolean = false;
  private debugState: boolean = false;

  constructor(state: T, option: Option = {}) {
    this.state = state;
    this.option = option;
    this.pushHistory(state);
  }

  public subscribe = (callback: (val: T) => void) => {
    this.callbacks.push(callback);
  };

  public unsubscribe = (callback: (val: T) => void) => {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  };

  public getState = () => this.state;

  public next = () => {
    if (this.timeMachineCursor === this.payloadHistory.length - 1) {
      return;
    }

    const newCursor = this.timeMachineCursor + 1;
    const nextPayload: Partial<T> = this.payloadHistory[newCursor];
    this.timeMachineCursor = newCursor;
    this.jumpHistory(nextPayload);
  };

  public prev = () => {
    if (this.timeMachineCursor === 0) {
      return;
    }
    const newCursor = this.timeMachineCursor - 1;
    const prevPayload: Partial<T> = this.payloadHistory[newCursor];
    this.timeMachineCursor = newCursor;
    this.jumpHistory(prevPayload);
  };

  public setState = (payload: Partial<T>, log = '') => {
    this.state = { ...this.state, ...payload };
    this.notify(this.state);
    this.pushHistory(payload);
    this.logByCondition(!!log, log);
    this.logByCondition(this.debugPayload, payload);
    this.logByCondition(this.debugState, this.state);
  };

  public enableDebugPayload = () => {
    this.debugPayload = true;
  };

  public enableDebugState = () => {
    this.debugState = true;
  };

  public disableDebugPayload = () => {
    this.debugPayload = false;
  };

  public disableDebugState = () => {
    this.debugState = false;
  };

  /* Private */

  private logByCondition = (condition: boolean | undefined, data: any) => {
    if (condition) {
      console.table ? console.table(data) : console.dir(data);
    }
  };

  private pushHistory = (payload: Partial<T>) => {
    if (this.option.saveHistory) {
      this.payloadHistory.push(payload);

      // reset payloadHistory to the latest.
      this.timeMachineCursor = this.payloadHistory.length - 1;
    }
  };

  private jumpHistory = (payload: Partial<T>) => {
    this.state = { ...this.state, ...payload };
    this.notify(this.state);
  };

  private notify = (val: T) => {
    this.callbacks.forEach(cb => {
      cb(val);
    });
  };
}
