# React Logistics

[![Build Status](https://travis-ci.com/AtaruOhto/react-logistics.svg?branch=master)](https://travis-ci.com/AtaruOhto/react-logistics)

React Context APIベースのシンプルな状態管理ライブラリ

## はじめに

### インストール

```shell
yarn add react-logistics
```

### Storeを作成する

"react-logistics" から "buildStore()" 関数をインポートします。そして、buildStore()関数でStoreを作成します。
TypeScriptを使っている場合、buildStore<T>()にはTypeScriptのジェネリクスを用いて、Stateの型を指定することができます。
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


```jsx
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



## API


### buildStore(initialState: T, keyName: string, Option: Object)


```jsx
import { buildStore, ReactLogisticsOption } from 'react-logistics';

const option = {
  exposeGlobal: true,
  saveHistory: true,
}

export const Todo = buildStore<TodoState>(initialState, 'MyTodoStore', option);
```

buildStore() メソッドはStoreを作成します。TypeScriptのジェネリクスを使ってStoreが保有するvalueの型を指定することができます。"Single source of truth"の原則に縛られていないため、Storeは幾つでも作成することができます。

#### Option

<table>
    <tr>
        <td>exposeGlobal</td>
        <td>expose the store to global window object. If store key name is 'myTodoStore', store will be accessible with window.myTodoStore. By exposing store to global on develping phase, you can directly call methods, such as "store.setState()", "store.getState()" may be helpful on debugginfg app.</td>
        <td>boolean</td>
    </tr>
    <tr>
        <td>saveHistory</td>
        <td>Store will keep and save each payload whenever setState() method is called. By enabling this option, "store.prev()" and "store.next()" methods will be available with which helps to implement features like "redo" and "undo" easily.</td>
        <td>boolean</td>        
    </tr>
</table>    



#### Store

created Store has these methods and properties.



<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>store.Provider</td>
    <td>By wrapping React Component with Provider, enables children of Provider to subscribe store values via component enhanced by withConsumer().</td>
  </tr>    
  <tr>
    <td>store.getState()</td>
    <td>get current store value.</td>
  </tr>
  <tr>
    <td>store.setState()</td>
    <td>set the value to store.</td>
  </tr>
  <tr>
    <td>store.wthConsumer()</td>
    <td>By applying withConsumer() to a React Component, enables the component to subscribe store value. Each time store value updated, new values comes and re-rendered.</td>
  </tr>    
  <tr>
    <td>store.enableDebugState()</td>
    <td>By calling the method, store will output the current state to console, whenever its value changed.</td>
  </tr>        
  <tr>
    <td>store.disableDebugState()</td>
    <td>Stop store to output the current state to console when its state is changed.</td>
  </tr>            
  <tr>
    <td>store.enableDebugPayload()</td>
    <td>By calling the method, store will output payload to console when its state is changed.</td>
  </tr>                
  <tr>
    <td>store.disableDebugPayload()</td>
    <td>Stop store to output payload to console when its state is changed.</td>
  </tr>                    
  <tr>
    <td>store.prev()</td>
    <td>Revert store to the previous state.</td>
  </tr>             
  <tr>
    <td>store.next()</td>
    <td>Proceed store to the next state.</td>
  </tr>                 
</table>





## Debugging and populating on Console



By exposeGlobal options to "true", store object becomes global and accessible from console.  You can populate store and debug without any difficult settings or procedure.



<img src="https://user-images.githubusercontent.com/3450879/52125778-e4e64680-2670-11e9-90ee-96d068af265c.jpg" alt="debug" />





