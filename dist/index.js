'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function getProvider(store, context) {
    return class Provider extends React.Component {
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
            return (React.createElement(context.Provider, { value: this.state }, this.props.children));
        }
    };
}

function getWithConsumer(context) {
    return (WrappedComponent) => (props) => (React.createElement(context.Consumer, null, context => React.createElement(WrappedComponent, Object.assign({}, props, context))));
}

class Store {
    constructor(state, option = {}) {
        this.callbacks = [];
        this.payloadHistory = [];
        this.timeMachineCursor = 0;
        this.debugPayload = false;
        this.debugState = false;
        this.subscribe = (callback) => {
            this.callbacks.push(callback);
        };
        this.unsubscribe = (callback) => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        };
        this.getState = () => this.state;
        this.next = () => {
            if (this.timeMachineCursor === this.payloadHistory.length - 1) {
                return;
            }
            const newCursor = this.timeMachineCursor + 1;
            const nextPayload = this.payloadHistory[newCursor];
            this.timeMachineCursor = newCursor;
            this.jumpHistory(nextPayload);
        };
        this.prev = () => {
            if (this.timeMachineCursor === 0) {
                return;
            }
            const newCursor = this.timeMachineCursor - 1;
            const prevPayload = this.payloadHistory[newCursor];
            this.timeMachineCursor = newCursor;
            this.jumpHistory(prevPayload);
        };
        this.setState = (payload, log = '') => {
            this.state = Object.assign({}, this.state, payload);
            this.notify(this.state);
            this.pushHistory(payload);
            this.logByCondition(!!log, log);
            this.logByCondition(this.debugPayload, payload);
            this.logByCondition(this.debugState, this.state);
        };
        this.enableDebugPayload = () => {
            this.debugPayload = true;
        };
        this.enableDebugState = () => {
            this.debugState = true;
        };
        this.disableDebugPayload = () => {
            this.debugPayload = false;
        };
        this.disableDebugState = () => {
            this.debugState = false;
        };
        /* Private */
        this.logByCondition = (condition, data) => {
            if (condition) {
                console.table ? console.table(data) : console.dir(data);
            }
        };
        this.pushHistory = (payload) => {
            if (this.option.saveHistory) {
                this.payloadHistory.push(payload);
                // reset payloadHistory to the latest.
                this.timeMachineCursor = this.payloadHistory.length - 1;
            }
        };
        this.jumpHistory = (payload) => {
            this.state = Object.assign({}, this.state, payload);
            this.notify(this.state);
        };
        this.notify = (val) => {
            this.callbacks.forEach(cb => {
                cb(val);
            });
        };
        this.state = state;
        this.option = option;
        this.pushHistory(state);
    }
}

function buildStore(initialVal, key, option = {}) {
    const store = new Store(initialVal, option);
    const context = React.createContext(initialVal);
    if (option.exposeGlobal && typeof window) {
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

exports.buildStore = buildStore;
