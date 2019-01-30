# React Logistics


Simple and Minimal state management library for React. Built upon React Context API internallly.

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

Store has these methods and properties.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
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
    <td>store.Provider</td>
    <td>By wrapping React Component with Provider, enables children of Provider to subscribe store values via component enhanced by withConsumer().</td>
  </tr>    
</table>


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

