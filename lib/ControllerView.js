"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
/**
 * A {ControllerView} is a ReactJS component that manages a specific space of the application state.
 * It is responsible for passing that part of the application state to other stateless/stateful components.
 * All components that requires access to the application state store must extends this class.
 *
 * @export
 * @class ControllerView
 * @extends {Component<T, V>}
 * @template T any object that extends/implements {ControllerViewProps}
 * @template V
 */
var ControllerView = (function (_super) {
    __extends(ControllerView, _super);
    function ControllerView(props, stateKey, initialState, reducer) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.$$store = props.store;
        _this.dispatch = _this.$$store.dispatch;
        _this.$$stateKey = stateKey;
        _this.$$reducer = reducer;
        return _this;
    }
    /**
     * Returns the component's reducer function
     *
     * @returns the component's {Reducer}
     */
    ControllerView.prototype.getReducer = function () {
        return this.$$reducer;
    };
    /**
     * Returns the component's state key.
     *
     * @returns {string} the component's state key.
     */
    ControllerView.prototype.getStateKey = function () {
        return this.$$stateKey;
    };
    /**
     * To be called when the component is first mounted to connect the component to the application store.
     * Note: if this method is overriden in the child class, the child class must call `super.componentDidMount()`
     */
    ControllerView.prototype.componentDidMount = function () {
        this.$$store.connect(this);
    };
    /**
     * To be called before the component is unmounted to disconnect the component from the application store.
     * Note: if this method is overriden in the child class, the child class must call `super.componentWillUnmount()`
     */
    ControllerView.prototype.componentWillUnmount = function () {
        this.$$store.disconnect(this);
    };
    return ControllerView;
}(React.Component));
exports.ControllerView = ControllerView;
