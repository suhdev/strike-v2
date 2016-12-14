'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _Util = require('./Util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function makeProps($inject, injector) {
    var props = {};
    $inject.map(function (e) {
        props[e] = injector.get(e);
    });
    return props;
}
function createApplicationBuilder(router, component) {
    var app = {
        routes: [],
        meta: {},
        component: component
    };
    function meta() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (args.length == 2) {
            app.meta[args[0]] = args[1];
        } else if (args.length == 1 && _typeof(app.meta) === "object") {
            app.meta = args[0];
        }
        return o;
    }
    function routeTest(fn) {
        app.routeTest = fn;
        return o;
    }
    function routes() {
        return routeBuilder;
    }
    function addRoute(route) {
        app.routes.push(route);
        return o;
    }
    function attach() {
        router.attachApp(app);
        return;
    }
    var o = {
        addRoute: addRoute,
        meta: meta,
        routes: routes,
        attach: attach
    };
    var routeBuilder = createRouteDefBuilder(o);
    return o;
}
function createRouteDefBuilder(router) {
    var route = {
        routeDef: null,
        params: {}
    };
    function rule(r) {
        route.routeDef = parseRoute(r);
        return o;
    }
    function data(d) {
        route.data = d;
        return o;
    }
    function onMount(callback) {
        route.onMount = callback;
        return o;
    }
    function onBeforeMount(fn) {
        route.onBeforeMount = fn;
        return o;
    }
    function create() {
        router.addRoute(route);
        return router;
    }
    function add() {
        router.addRoute(route);
        route = {
            routeDef: null
        };
        return o;
    }
    var o = {
        add: add,
        rule: rule,
        data: data,
        onMount: onMount,
        onBeforeMount: onBeforeMount,
        create: create
    };
    return o;
}
function makeRouteFromMatches(route, matches) {
    var i = 0,
        def = route.routeDef,
        params = def.routeParams,
        l = params.length;
    for (; i < l; i++) {
        route.params[params[i][0]] = TYPES_TO_PARSE[params[i][1]](matches[i + 1]);
    }
    return route;
}
var TYPES_TO_REGEX = {
    "number": '([0-9]+)',
    "string": '([\S]+)',
    "boolean": '(true|false|TRUE|FALSE)'
};
var TYPES_TO_PARSE = {
    "number": parseFloat,
    "string": _Util.identity,
    "boolean": function boolean(v) {
        if (v.toLowerCase() === "true") {
            return true;
        }
        return false;
    }
};
function parseRoute(route) {
    var routeParams = [];
    var r = route.replace(/:([\S]+):(number|string|boolean)/g, function (e, k, v) {
        routeParams.push([k, v]);
        return TYPES_TO_REGEX[v];
    }).replace(/:([\S]+)/g, function (e, k) {
        routeParams.push([k, "string"]);
        return TYPES_TO_REGEX["string"];
    });
    return {
        routeParams: routeParams,
        regex: new RegExp("^" + r + "$", "i")
    };
}

var HashChangeStrategy = function () {
    function HashChangeStrategy(handler) {
        var _this = this;

        _classCallCheck(this, HashChangeStrategy);

        this._prevHash = null;
        this._handler = handler;
        this._currentHash = location.hash.substr(1);
        this._onHashChange = this._onHashChange.bind(this);
        setTimeout(function () {
            _this._handler.onRouteChange(_this._currentHash, '');
        }, 0);
        window.addEventListener('hashchange', this._onHashChange);
    }

    _createClass(HashChangeStrategy, [{
        key: '_onHashChange',
        value: function _onHashChange() {
            var prev = this._prevHash = this._currentHash;
            var current = this._currentHash = location.hash.substr(1);
            this._handler.onRouteChange(current, prev);
        }
    }, {
        key: 'getCurrentRoute',
        value: function getCurrentRoute() {
            return this._currentHash;
        }
    }, {
        key: 'getPrevRoute',
        value: function getPrevRoute() {
            return this._prevHash;
        }
    }, {
        key: 'setHandler',
        value: function setHandler(handler) {
            this._handler = handler;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            window.removeEventListener('hashchange', this._onHashChange);
        }
    }]);

    return HashChangeStrategy;
}();

var Router = exports.Router = function () {
    function Router(el, store, injector, opts) {
        _classCallCheck(this, Router);

        this._el = el;
        this._store = store;
        this._injector = injector;
        this._defaultApp = {
            component: null,
            routes: []
        };
        this._actionType = opts.actionType;
        this._appDefs = [this._defaultApp];
        this._currentRoute = null;
        this._strategy = opts.strategy || new HashChangeStrategy(this);
    }

    _createClass(Router, [{
        key: 'onRouteChange',
        value: function onRouteChange(newRoute, prevRoute) {
            var i = 0,
                apps = this._appDefs,
                l = apps.length,
                app = null,
                routes = null,
                route = null,
                test = null,
                r = null,
                found = false,
                def = null,
                matches = null;
            for (; i < l; i++) {
                app = apps[i];
                // if ((test = app.routeTest) && 
                //     ((typeof test === "string" && (new RegExp(test)).test(newRoute)) || 
                //     (test && test.test && test.test(newRoute)) || 
                //     typeof test === "function" && test(newRoute))){
                //     found = true; 
                // }
                routes = app.routes;
                for (var j = 0, m = routes.length; j < m; j++) {
                    route = routes[j];
                    def = route.routeDef;
                    r = def.regex;
                    r.lastIndex = 0;
                    if (matches = newRoute.match(r)) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
            if (found) {
                var _newRoute = makeRouteFromMatches(route, matches);
                if (this._currentRoute !== route) {
                    this._prevRoute = this._currentRoute;
                    this._currentRoute = _newRoute;
                    route.onBeforeMount && route.onBeforeMount();
                    if (app.component) {
                        ReactDOM.unmountComponentAtNode(this._el);
                        var Comp = app.component;
                        var props = makeProps(app.$inject || [], this._injector);
                        props.store = this._store;
                        this._activeComponent = ReactDOM.render(React.createElement(app.component, props), this._el, route.onMount);
                        this._store.dispatch({
                            type: this._actionType,
                            data: {
                                route: {
                                    data: route.data,
                                    params: route.params
                                },
                                appMeta: app.meta
                            }
                        });
                    }
                }
                this._store.dispatch({
                    type: this._actionType,
                    data: {
                        route: {
                            data: route.data,
                            params: route.params
                        },
                        appMeta: app.meta
                    }
                });
            }
        }
    }, {
        key: 'attachApp',
        value: function attachApp(appDef) {
            this._appDefs.push(appDef);
        }
    }, {
        key: 'route',
        value: function route() {
            return createRouteDefBuilder(this);
        }
    }, {
        key: 'addRoute',
        value: function addRoute(route) {
            this._defaultApp.routes.push(route);
        }
    }, {
        key: 'data',
        value: function data(key, val) {
            var cr = this._currentRoute;
            if (arguments.length > 1) {
                cr && (0, _Util.setDataAt)(cr.data, key, val, '.');
                return;
            }
            return cr && (0, _Util.getDataAt)(cr.data, key, '.');
        }
    }, {
        key: 'param',
        value: function param(key) {
            return this._currentRoute && this._currentRoute.params[key];
        }
    }, {
        key: 'register',
        value: function register(application) {
            return createApplicationBuilder(this, application);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._strategy.destroy();
        }
    }]);

    return Router;
}();