"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
const Util_1 = require("./Util");
function makeProps($inject, injector) {
    let props = {};
    $inject.map((e) => {
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
    function meta(...args) {
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
    let o = {
        addRoute: addRoute,
        meta,
        routes,
        attach,
    };
    let routeBuilder = createRouteDefBuilder(o);
    return o;
}
function createRouteDefBuilder(router) {
    let route = {
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
    let o = {
        add,
        rule,
        data,
        onMount,
        onBeforeMount,
        create,
    };
    return o;
}
function makeRouteFromMatches(route, matches) {
    let i = 0, def = route.routeDef, params = def.routeParams, l = params.length;
    for (; i < l; i++) {
        route.params[params[i][0]] = TYPES_TO_PARSE[params[i][1]](matches[i + 1]);
    }
    return route;
}
const TYPES_TO_REGEX = {
    "number": '([0-9]+)',
    "string": '([\S]+)',
    "boolean": '(true|false|TRUE|FALSE)',
};
const TYPES_TO_PARSE = {
    "number": parseFloat,
    "string": Util_1.identity,
    "boolean": (v) => {
        if (v.toLowerCase() === "true") {
            return true;
        }
        return false;
    }
};
function parseRoute(route) {
    let routeParams = [];
    let r = route.replace(/:([\S]+):(number|string|boolean)/g, (e, k, v) => {
        routeParams.push([k, v]);
        return TYPES_TO_REGEX[v];
    }).replace(/:([\S]+)/g, (e, k) => {
        routeParams.push([k, "string"]);
        return TYPES_TO_REGEX["string"];
    });
    return {
        routeParams: routeParams,
        regex: new RegExp("^" + r + "$", "i"),
    };
}
class HashChangeStrategy {
    constructor(handler) {
        this._prevHash = null;
        this._handler = handler;
        this._currentHash = location.hash.substr(1);
        this._onHashChange = this._onHashChange.bind(this);
        setTimeout(() => {
            this._handler.onRouteChange(this._currentHash, '');
        }, 0);
        window.addEventListener('hashchange', this._onHashChange);
    }
    _onHashChange() {
        let prev = this._prevHash = this._currentHash;
        let current = this._currentHash = location.hash.substr(1);
        console.log(current);
        this._handler.onRouteChange(current, prev);
    }
    getCurrentRoute() {
        return this._currentHash;
    }
    getPrevRoute() {
        return this._prevHash;
    }
    setHandler(handler) {
        this._handler = handler;
    }
    destroy() {
        window.removeEventListener('hashchange', this._onHashChange);
    }
}
class Router {
    constructor(el, store, injector, opts) {
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
    onRouteChange(newRoute, prevRoute) {
        let i = 0, apps = this._appDefs, l = apps.length, app = null, routes = null, route = null, test = null, r = null, found = false, def = null, matches = null;
        for (; i < l; i++) {
            app = apps[i];
            // if ((test = app.routeTest) && 
            //     ((typeof test === "string" && (new RegExp(test)).test(newRoute)) || 
            //     (test && test.test && test.test(newRoute)) || 
            //     typeof test === "function" && test(newRoute))){
            //     found = true; 
            // }
            routes = app.routes;
            for (let j = 0, m = routes.length; j < m; j++) {
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
            let newRoute = makeRouteFromMatches(route, matches);
            if (this._currentRoute !== route) {
                this._prevRoute = this._currentRoute;
                this._currentRoute = newRoute;
                route.onBeforeMount && route.onBeforeMount();
                if (app.component) {
                    ReactDOM.unmountComponentAtNode(this._el);
                    const Comp = app.component;
                    let props = makeProps(app.$inject || [], this._injector);
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
    attachApp(appDef) {
        this._appDefs.push(appDef);
    }
    route() {
        return createRouteDefBuilder(this);
    }
    addRoute(route) {
        this._defaultApp.routes.push(route);
    }
    data(key, val) {
        let cr = this._currentRoute;
        if (arguments.length > 1) {
            cr && Util_1.setDataAt(cr.data, key, val, '.');
            return;
        }
        return cr && Util_1.getDataAt(cr.data, key, '.');
    }
    param(key) {
        return this._currentRoute && this._currentRoute.params[key];
    }
    register(application) {
        return createApplicationBuilder(this, application);
    }
    destroy() {
        this._strategy.destroy();
    }
}
exports.Router = Router;
