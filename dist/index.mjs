import { Component, createElement, createContext } from 'react';

function getProvider(store, context) {
    return class Provider extends Component {
        constructor(props) {
            super(props);
            this.subscribeCounter = (val) => {
                this.setState(val);
            };
            this.state = store.getState();
        }
        componentWillMount() {
            store.subscribe(this.subscribeCounter);
        }
        componentWillUnmount() {
            store.unsubscribe(this.subscribeCounter);
        }
        render() {
            return (createElement(context.Provider, { value: this.state }, this.props.children));
        }
    };
}

function getWithConsumer(context) {
    return (WrappedComponent) => (props) => (createElement(context.Consumer, null, context => createElement(WrappedComponent, Object.assign({}, props, context))));
}

class Store {
    constructor(state, key, option = {}) {
        this.callbacks = [];
        this.subscribe = (callback) => {
            this.callbacks.push(callback);
        };
        this.unsubscribe = (callback) => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        };
        this.getState = () => this.state;
        this.setState = (newStatePartial) => {
            this.logByCondition(this.option.debug && this.option.debug.beforeUpdate, this.state);
            this.state = Object.assign({}, this.state, newStatePartial);
            this.notify(this.state);
            this.logByCondition(this.option.debug && this.option.debug.payload, newStatePartial);
            this.logByCondition(this.option.debug && this.option.debug.afterUpdate, this.state);
        };
        /* Private */
        this.logByCondition = (condition, data) => {
            if (condition) {
                console.log(`store ${this.key} was updated`);
                console.log(data);
            }
        };
        this.notify = (val) => {
            this.callbacks.forEach(cb => {
                cb(val);
            });
        };
        this.state = state;
        this.key = key;
        this.option = option;
    }
}

function buildStore(initialVal, key, option = {}) {
    const store = new Store(initialVal, key, option);
    const context = createContext(initialVal);
    if (option.debug && option.debug.global && typeof window) {
        const w = window;
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

export { buildStore };
