# React Logistics

React Context APIベースのシンプルな状態管理ライブラリ

## はじめに

### インストール

```shell
yarn add react-logistics
```

### Storeを作成する

"react-logistics" から "buildStore()" 関数をインポートします。そして、buildStore()関数でStoreを作成します。
TypeScriptを使っている場合、buildStoreにはTypeScriptのジェネリクスを用いて、Stateの型を指定することができます。
こうすることで型の支援を受けることができ、不正な値が入り込むことを防ぐことができます。


```jsx
import { buildStore, ReactLogisticsOption } from 'react-logistics';

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const option: ReactLogisticsOption = {
  exposeGlobal: true /* グローバルなwindowオブジェクトの下にStoreを生やします。 */,
  saveHistory: true /* 各Payloadの履歴をStore内部に保存します。履歴を保存することで、store.prev()やstore.next()が使えるようになり、以前のStateの状態に戻したりすることができます。 */,
};

/* Storeを生成します。 */
const counterStore = buildStore<CounterState>(
  initialState,
  'MyCounterStore',
  option,
);
```

Storeを更新するためには、 store.setState()メソッドを呼び出す必要があります。counterStore.setState({})というように直接呼び出すこともできますが、ここでは専用の関数を用意します。


```jsx
/* Define Actions. It's completely arbitrary to define actions and you can call store.setState() directly */
export const increment = (count: number) => {
  counterStore.setState({ count: count += 1 });
};

export const decrement = (count: number) => {
  counterStore.setState({ count: count -= 1 });
};
```

React Context APIでStoreの値を購読するには、Context.ConsumerでコンポーネントをHoc形式でラッピングしてあげる必要があります。React Logisticsでは store.withConsumer() メソッドがこの役割を担います。store.withConsumer<T>()を適用したコンポーネントは、自動的にStoreの値を購読するようになり、Storeが更新されるたびに再レンダリングされます。


```jsx
const CounterComponent = ({ count }: CounterState) => (
  <div>
    <h1>{count}</h1>
    <button
      onClick={() => {
        increment(count);
      }}
    >
      increment
    </button>
    <button
      onClick={() => {
        decrement(count);
      }}
    >
      decrement
    </button>
  </div>
);

/* Enhance a component with store.withConsumer function. */
const EnhancedCounter = counterStore.withConsumer<CounterState>(
  CounterComponent,
);
```

### store.Provider

withConsumer() メソッドでラッピングされたコンポーネントに値を購読させるには、store.Providerがそれらのコンポーネントの祖先として、下記のコードのように定義されている必要があります。こうすることで、Storeの値の変化を購読することができるようになります


```jsx
/* In order to subscribe store value, define Provider as the parent of the component which is enhanced by withConsumer(). */
const App = () => (
  <counterStore.Provider>
    <div>
      <EnhancedCounter />
    </div>
  </counterStore.Provider>
);

```



## TypeScriptでのカウンターアプリの例 (1ファイル)

```
import React from 'react';
import ReactDOM from 'react-dom';
import { buildStore, ReactLogisticsOption } from 'react-logistics';

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const option: ReactLogisticsOption = {
  exposeGlobal: true /* expose store to global object. you can call store.setState() and getState() directly from console. */,
  saveHistory: true /* saving payload history, enables time machine. */,
};

const counterStore = buildStore<CounterState>(
  initialState,
  'MyCounterStore',
  option,
);

/* Define Actions. It's completely arbitrary to define actions and you can call store.setState() directly */
export const increment = (count: number) => {
  counterStore.setState({ count: count += 1 });
};

export const decrement = (count: number) => {
  counterStore.setState({ count: count -= 1 });
};

const CounterComponent = ({ count }: CounterState) => (
  <div>
    <h1>{count}</h1>
    <button
      onClick={() => {
        increment(count);
      }}
    >
      increment
    </button>
    <button
      onClick={() => {
        decrement(count);
      }}
    >
      decrement
    </button>
  </div>
);

/* Enhance a component with store.withConsumer function. */
const EnhancedCounter = counterStore.withConsumer<CounterState>(
  CounterComponent,
);

const App = () => (
  <counterStore.Provider>
    <div>
      <EnhancedCounter />
    </div>
  </counterStore.Provider>
);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);

```
