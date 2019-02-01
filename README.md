# React Logistics

[![Build Status](https://travis-ci.com/AtaruOhto/react-logistics.svg?branch=master)](https://travis-ci.com/AtaruOhto/react-logistics)

Simple and Minimal state management library for React. Easy to debug. Built upon React Context API.

## Getting Started

### Install via npm

```shell
yarn add react-logistics
```


### Create Stores

import *react-logistics* and create stores with *buildStore()* function.
If you use TypeScript, react-logistics supports type-safe development experience via TypeScript generics and prevent from putting invalid values into the store.

```jsx
import { buildStore, ReactLogisticsOption } from 'react-logistics';

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const option: ReactLogisticsOption = {
  exposeGlobal: true /* expose store to global object. By setting this option, you can call store.setState() and getState() directly from console. */,
  saveHistory: true /* saving payload history, enables time machine with store.prev() and next() method. */,
};

/* Define Store */
const counterStore = buildStore<CounterState>(
  initialState,
  'MyCounterStore',
  option,
);
```

### Define Functions to mutate store

store.setState() method will mutate store values and you can call setState() dilecty like "counterStore.setState({})". However here we define actions to set values to store. It's completely arbitrary to do so. 


```jsx
/* Define Actions. It's completely arbitrary to define actions and you can call store.setState() directly */
export const increment = (count: number) => {
  counterStore.setState({ count: count += 1 });
};

export const decrement = (count: number) => {
  counterStore.setState({ count: count -= 1 });
};
```

### Enhance a component with withConsumer()

In order to subscribe the store values with React Context API, you need to enhance a component with Context.Consumer with the form of HoC. In React Logistics, store.withConsumer() method undertakes the role. We define a component which will be enhanced with store.withConsumer(). A component enhanced with withConsumer<T>() automatically subscribe store's value changes and re-render itself whenever connected store changed.

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

### Locate store.Provider as an ancestor

In order to make a component wrapped with withConsumer() subscribe values, Provider is needed to be located as an ancestor component as the code below. Thus enhanced components are able to subscribe value changes.


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


## TypeScript Counter Example (one file full version)

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


buildStore() method create a store. You can specify type of State via TypeScript generics <T>. React Logistics is not bound to the discipling of the "Single source of truth", and you can create store as many as you want.

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





## Debugging and populating on Console

By exposeGlobal options to "true", store object becomes global and accessible from console.  You can populate store and debug without any difficult settings or procedure.



<img src="https://user-images.githubusercontent.com/3450879/52125778-e4e64680-2670-11e9-90ee-96d068af265c.jpg" alt="debug" />





