"use strict";
const React = require("react");
const Store_1 = require("./Store");
const ControllerView_1 = require("./ControllerView");
const Injector_1 = require("./Injector");
const Immutable = require("immutable");
const Router_1 = require("./Router");
function reduce1(state, action) {
    console.log(action);
    let newState = state;
    switch (action.type) {
        case 0xFF000001:
            newState = newState.set('id', action.data.route.params.id);
            break;
        case 1:
            newState = newState.set('id', newState.get('id') + action.data);
            break;
    }
    return newState;
}
function reduce2(state, action) {
    let newState = state;
    switch (action.type) {
        case 0xFF000001:
            newState = newState.set('index', action.data.route.params.id);
            break;
        case 1:
            newState = newState.set('id', newState.get('id') - action.data);
            break;
    }
    return newState;
}
class Example1 extends ControllerView_1.ControllerView {
    constructor(props) {
        super(props, 'example', {}, reduce1);
        this.onCountClick = this.onCountClick.bind(this);
    }
    onCountClick() {
        this.dispatch({
            type: 0x0001,
            data: 2
        });
    }
    render() {
        let state = this.state;
        return (React.createElement("div", { className: "example-1", "data-type": "1" },
            React.createElement("div", { className: "btn", onClick: this.onCountClick },
                "Count: ",
                state.id,
                " ")));
    }
}
exports.Example1 = Example1;
class Example2 extends ControllerView_1.ControllerView {
    constructor(props) {
        super(props, 'example2', {}, reduce2);
    }
    render() {
        let state = this.state;
        return (React.createElement("div", { className: "example-2", "data-type": "2" },
            "This is just a test. ",
            state.index,
            " "));
    }
}
exports.Example2 = Example2;
(function () {
    let injector = new Injector_1.Injector();
    let store = new Store_1.Store({
        ready: true,
        trackChanges: false,
        initialState: Immutable.Map(),
        middlewares: []
    });
    injector.addInstance('store', store);
    let router = new Router_1.Router(document.getElementById('ViewPort'), store, injector, {
        actionType: 0xFF000001,
    });
    injector.addInstance('router', router);
    router.register(Example1)
        .meta('name', 'Example 1')
        .meta('id', 0x00001)
        .routes()
        .rule('task/:id:number')
        .data({ firstName: 'Suhail', lastName: 'Abood' })
        .add()
        .rule('task/:userId')
        .data({ firstName: 'Yaman', lastName: 'Al-Kamaly' })
        .create()
        .attach();
    router.register(Example2)
        .meta('name', 'Example 2')
        .meta('id', 0x00002)
        .routes()
        .rule('note/:id:number')
        .data({ firstName: 'Najm', lastName: 'Abood' })
        .add()
        .rule('note/:userId')
        .data({ firstName: 'Dergham', lastName: 'Al-Kamaly' })
        .create()
        .attach();
}());
