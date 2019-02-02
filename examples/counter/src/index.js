import React from 'react';
import ReactDOM from 'react-dom';
import { buildStore, ReactLogisticsOption } from 'react-logistics';
import './index.css';
import * as serviceWorker from './serviceWorker';

const initialState = {
  count: 0,
};

const option = {
  exposeGlobal: true /* expose store to global object. you can call store.setState() and getState() directly from console. */,
  saveHistory: true /* saving payload history, enables time machine. */,
};

const counterStore = buildStore(initialState, 'MyCounterStore', option);

/* Define Actions. It's completely arbitrary to define actions and you can call store.setState() directly */
export const increment = count => {
  counterStore.setState({ count: (count += 1) });
};

export const decrement = count => {
  counterStore.setState({ count: (count -= 1) });
};

const CounterComponent = ({ count }) => (
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
const EnhancedCounter = counterStore.withConsumer(CounterComponent);

const App = () => (
  <counterStore.Provider>
    <div>
      <EnhancedCounter />
    </div>
  </counterStore.Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
