"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Util_1 = require('./Util');
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
        component: component,
    };
    function meta() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length == 2) {
            app.meta[args[0]] = args[1];
        }
        else if (args.length == 1 && typeof app.meta === "object") {
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
        attach: attach,
    };
    var routeBuilder = createRouteDefBuilder(o);
    return o;
}
function createRouteDefBuilder(router) {
    var route = {
        routeDef: null,
        params: {},
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
        create: create,
    };
    return o;
}
function makeRouteFromMatches(route, matches) {
    var i = 0, def = route.routeDef, params = def.routeParams, l = params.length;
    for (; i < l; i++) {
        route.params[params[i][0]] = TYPES_TO_PARSE[params[i][1]](matches[i + 1]);
    }
    return route;
}
var TYPES_TO_REGEX = {
    "number": '([0-9]+)',
    "string": '([\S]+)',
    "boolean": '(true|false|TRUE|FALSE)',
};
var TYPES_TO_PARSE = {
    "number": parseFloat,
    "string": Util_1.identity,
    "boolean": function (v) {
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
        regex: new RegExp("^" + r + "$", "i"),
    };
}
var HashChangeStrategy = (function () {
    function HashChangeStrategy(handler) {
        var _this = this;
        this._prevHash = null;
        this._handler = handler;
        this._currentHash = location.hash.substr(1);
        this._onHashChange = this._onHashChange.bind(this);
        setTimeout(function () {
            _this._handler.onRouteChange(_this._currentHash, '');
        }, 0);
        window.addEventListener('hashchange', this._onHashChange);
    }
    HashChangeStrategy.prototype._onHashChange = function () {
        var prev = this._prevHash = this._currentHash;
        var current = this._currentHash = location.hash.substr(1);
        this._handler.onRouteChange(current, prev);
    };
    HashChangeStrategy.prototype.getCurrentRoute = function () {
        return this._currentHash;
    };
    HashChangeStrategy.prototype.getPrevRoute = function () {
        return this._prevHash;
    };
    HashChangeStrategy.prototype.setHandler = function (handler) {
        this._handler = handler;
    };
    HashChangeStrategy.prototype.destroy = function () {
        window.removeEventListener('hashchange', this._onHashChange);
    };
    return HashChangeStrategy;
}());
var Router = (function () {
    function Router(el, store, injector, opts) {
        this._el = el;
        this._store = store;
        this._injector = injector;
        this._defaultApp = {
            component: null,
            routes: [],
        };
        this._actionType = opts.actionType;
        this._appDefs = [this._defaultApp];
        this._currentRoute = null;
        this._strategy = opts.strategy || new HashChangeStrategy(this);
    }
    Router.prototype.onRouteChange = function (newRoute, prevRoute) {
        var i = 0, apps = this._appDefs, l = apps.length, app = null, routes = null, route = null, test = null, r = null, found = false, def = null, matches = null;
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
            var newRoute_1 = makeRouteFromMatches(route, matches);
            if (this._currentRoute !== route) {
                this._prevRoute = this._currentRoute;
                this._currentRoute = newRoute_1;
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
    };
    Router.prototype.attachApp = function (appDef) {
        this._appDefs.push(appDef);
    };
    Router.prototype.route = function () {
        return createRouteDefBuilder(this);
    };
    Router.prototype.addRoute = function (route) {
        this._defaultApp.routes.push(route);
    };
    Router.prototype.data = function (key, val) {
        var cr = this._currentRoute;
        if (arguments.length > 1) {
            cr && Util_1.setDataAt(cr.data, key, val, '.');
            return;
        }
        return cr && Util_1.getDataAt(cr.data, key, '.');
    };
    Router.prototype.param = function (key) {
        return this._currentRoute && this._currentRoute.params[key];
    };
    Router.prototype.register = function (application) {
        return createApplicationBuilder(this, application);
    };
    Router.prototype.destroy = function () {
        this._strategy.destroy();
    };
    return Router;
}());
exports.Router = Router;
