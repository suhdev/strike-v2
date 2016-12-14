"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Store_1 = require('./Store');
var ControllerView_1 = require('./ControllerView');
var Injector_1 = require('./Injector');
var Immutable = require('immutable');
var Router_1 = require('./Router');
function reduce1(state, action) {
    var newState = state;
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
    var newState = state;
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
var Example1 = (function (_super) {
    __extends(Example1, _super);
    function Example1(props) {
        _super.call(this, props, 'example', {}, reduce1);
        this.onCountClick = this.onCountClick.bind(this);
    }
    Example1.prototype.onCountClick = function () {
        this.dispatch({
            type: 0x0001,
            data: 2
        });
    };
    Example1.prototype.render = function () {
        var state = this.state;
        return (React.createElement("div", {className: "example-1", "data-type": "1"}, 
            React.createElement("div", {className: "btn", onClick: this.onCountClick}, 
                "Count: ", 
                state.id, 
                " ")
        ));
    };
    return Example1;
}(ControllerView_1.ControllerView));
exports.Example1 = Example1;
var Example2 = (function (_super) {
    __extends(Example2, _super);
    function Example2(props) {
        _super.call(this, props, 'example2', {}, reduce2);
    }
    Example2.prototype.render = function () {
        var state = this.state;
        return (React.createElement("div", {className: "example-2", "data-type": "2"}, 
            "This is just a test. ", 
            state.index, 
            " "));
    };
    return Example2;
}(ControllerView_1.ControllerView));
exports.Example2 = Example2;
(function () {
    var injector = new Injector_1.Injector();
    var store = new Store_1.Store({
        ready: true,
        trackChanges: false,
        initialState: Immutable.Map(),
        middlewares: []
    });
    injector.addInstance('store', store);
    var router = new Router_1.Router(document.getElementById('ViewPort'), store, injector, {
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
