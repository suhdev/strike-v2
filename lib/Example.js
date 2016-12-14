'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Example2 = exports.Example1 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Store = require('./Store');

var _ControllerView3 = require('./ControllerView');

var _Injector = require('./Injector');

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

var _Router = require('./Router');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Example1 = exports.Example1 = function (_ControllerView) {
    _inherits(Example1, _ControllerView);

    function Example1(props) {
        _classCallCheck(this, Example1);

        var _this = _possibleConstructorReturn(this, (Example1.__proto__ || Object.getPrototypeOf(Example1)).call(this, props, 'example', {}, reduce1));

        _this.onCountClick = _this.onCountClick.bind(_this);
        return _this;
    }

    _createClass(Example1, [{
        key: 'onCountClick',
        value: function onCountClick() {
            this.dispatch({
                type: 0x0001,
                data: 2
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;
            return React.createElement("div", { className: "example-1", "data-type": "1" }, React.createElement("div", { className: "btn", onClick: this.onCountClick }, "Count: ", state.id, " "));
        }
    }]);

    return Example1;
}(_ControllerView3.ControllerView);

var Example2 = exports.Example2 = function (_ControllerView2) {
    _inherits(Example2, _ControllerView2);

    function Example2(props) {
        _classCallCheck(this, Example2);

        return _possibleConstructorReturn(this, (Example2.__proto__ || Object.getPrototypeOf(Example2)).call(this, props, 'example2', {}, reduce2));
    }

    _createClass(Example2, [{
        key: 'render',
        value: function render() {
            var state = this.state;
            return React.createElement("div", { className: "example-2", "data-type": "2" }, "This is just a test. ", state.index, " ");
        }
    }]);

    return Example2;
}(_ControllerView3.ControllerView);

(function () {
    var injector = new _Injector.Injector();
    var store = new _Store.Store({
        ready: true,
        trackChanges: false,
        initialState: Immutable.Map(),
        middlewares: []
    });
    injector.addInstance('store', store);
    var router = new _Router.Router(document.getElementById('ViewPort'), store, injector, {
        actionType: 0xFF000001
    });
    injector.addInstance('router', router);
    router.register(Example1).meta('name', 'Example 1').meta('id', 0x00001).routes().rule('task/:id:number').data({ firstName: 'Suhail', lastName: 'Abood' }).add().rule('task/:userId').data({ firstName: 'Yaman', lastName: 'Al-Kamaly' }).create().attach();
    router.register(Example2).meta('name', 'Example 2').meta('id', 0x00002).routes().rule('note/:id:number').data({ firstName: 'Najm', lastName: 'Abood' }).add().rule('note/:userId').data({ firstName: 'Dergham', lastName: 'Al-Kamaly' }).create().attach();
})();