'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ControllerView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var ControllerView = exports.ControllerView = function (_Component) {
    _inherits(ControllerView, _Component);

    function ControllerView(props, stateKey, initialState, reducer) {
        _classCallCheck(this, ControllerView);

        var _this = _possibleConstructorReturn(this, (ControllerView.__proto__ || Object.getPrototypeOf(ControllerView)).call(this, props));

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


    _createClass(ControllerView, [{
        key: 'getReducer',
        value: function getReducer() {
            return this.$$reducer;
        }
        /**
         * Returns the component's state key.
         *
         * @returns {string} the component's state key.
         */

    }, {
        key: 'getStateKey',
        value: function getStateKey() {
            return this.$$stateKey;
        }
        /**
         * To be called when the component is first mounted to connect the component to the application store.
         * Note: if this method is overriden in the child class, the child class must call `super.componentDidMount()`
         */

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.$$store.connect(this);
        }
        /**
         * To be called before the component is unmounted to disconnect the component from the application store.
         * Note: if this method is overriden in the child class, the child class must call `super.componentWillUnmount()`
         */

    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.$$store.disconnect(this);
        }
    }]);

    return ControllerView;
}(_react.Component);