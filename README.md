# React Logistics

Simple and Minimal state management library for React. Easy to debug. Built upon React Context API.

## Getting Started

### Install via npm

```shell
yarn add react-logistics
```

### Create Stores

import *react-logistics* and create stores with *buildStore()* function.
react-logistics supports type-safe development experience via TypeScript generics.

```jsx
/* TypeScript */
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Logistics from "react-logistics";

interface CounterState {
  counter: number;
}

const initialState: CounterState = { counter: 0 };
const StoreName = "MyCounterStore";
const option = {
  debug: {
    afterUpdate: true,
    global: true
  }
};

/* Define Store */
const counterStore = Logistics.buildStore<CounterState>(
  initialState,
  StoreName,
  option
);
```



Define a component which will be enhanced by withConsmer() function and increment and decrement action. Defining action is completely arbitrary and you can call *store.setState()* dilectly.




```jsx
/* Define Actions */
const increment = (counter: number) => {
  counterStore.setState({ counter: counter += 1 });
};

const decrement = (counter: number) => {
  counterStore.setState({ counter: counter -= 1 });
};

/* By enhancing withConsumer() below, the component can access store value. */
const Counter = ({ counter }: CounterState) => (
  <div>
    <h1>{counter}</h1>
    <button
      onClick={() => {
        increment(counter);
      }}
    >
      increment
    </button>
    <button
      onClick={() => {
        decrement(counter);
      }}
    >
      decrement
    </button>
  </div>
);

/* Enhance a component with store.withConsumer() function. */
const ConnectedCounter = counterStore.withConsumer<CounterState>(Counter);
```



```jsx
/* In order to subscribe store value, define Provider as the parent of the component which is enhanced by withConsumer(). */
const App = () => (
  <counterStore.Provider>
    <div>
      <ConnectedCounter />
    </div>
  </counterStore.Provider>
);

```







## TypeScript Example (Full Long Example)

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Logistics from "react-logistics";

interface CounterState {
  counter: number;
}

const initialState: CounterState = { counter: 0 };
const StoreName = "MyCounterStore";
const option = {
  debug: {
    afterUpdate: true,
    global: true
  }
};

/* Define Store */
const counterStore = Logistics.buildStore<CounterState>(
  initialState,
  StoreName,
  option
);

/* Define Actions */
const increment = (counter: number) => {
  counterStore.setState({ counter: counter += 1 });
};

const decrement = (counter: number) => {
  counterStore.setState({ counter: counter -= 1 });
};

const Counter = ({ counter }: CounterState) => (
  <div>
    <h1>{counter}</h1>
    <button
      onClick={() => {
        increment(counter);
      }}
    >
      increment
    </button>
    <button
      onClick={() => {
        decrement(counter);
      }}
    >
      decrement
    </button>
  </div>
);

/* Enhance a component with store.withConsumer function. */
const ConnectedCounter = counterStore.withConsumer<CounterState>(Counter);

const App = () => (
  <counterStore.Provider>
    <div>
      <ConnectedCounter />
    </div>
  </counterStore.Provider>
);

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
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



buildStore() method create a store. You can specify type of State via TypeScript generics *<T>*  and develop with type safe. React Logistics is not boud to the discipling of the "single source of the truth", and you can create store as many as you want.

#### Available Option

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





## Debugging from console



By exposeGlobal options to "true", store object becomes global and accessible from console.  You can populate store and debug without any difficult settings or procedure.



<img src="https://user-images.githubusercontent.com/3450879/52125778-e4e64680-2670-11e9-90ee-96d068af265c.jpg" alt="debug" />





