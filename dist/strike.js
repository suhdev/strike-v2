/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var AppActionDispatcher_1 = __webpack_require__(1);
	var Combiner_1 = __webpack_require__(2);
	var Router_1 = __webpack_require__(3);
	var Store_1 = __webpack_require__(8);
	var WorkerMiddleware_1 = __webpack_require__(11);
	var PromisifyMiddleware_1 = __webpack_require__(12);
	var Injector_1 = __webpack_require__(13);
	var ControllerView_1 = __webpack_require__(14);
	var IntegerPromisifyMiddleware_1 = __webpack_require__(15);
	var Util_1 = __webpack_require__(7);
	var InjectableMiddleware_1 = __webpack_require__(16);
	(function () {
	    if (window && document) {
	        window.StrikeJS = {
	            AppActionDispatcher: AppActionDispatcher_1.AppActionDispatcher,
	            Combiner: Combiner_1.Combiner,
	            Router: Router_1.Router,
	            Store: Store_1.Store,
	            WorkerMiddleware: WorkerMiddleware_1.WorkerMiddleware,
	            ControllerView: ControllerView_1.ControllerView,
	            Injector: Injector_1.Injector,
	            Promisify: PromisifyMiddleware_1.Promisify,
	            IntegerPromisifer: IntegerPromisifyMiddleware_1.IntegerPromisifer,
	            printf: Util_1.printf,
	            format: Util_1.format,
	            setDataAt: Util_1.setDataAt,
	            getDataAt: Util_1.getDataAt,
	            createFormatter: Util_1.createFormatter,
	            Injectable: InjectableMiddleware_1.Injectable
	        };
	    }
	}());


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	function AppActionDispatcher(store) {
	    var STEP = 0x01000000;
	    var apps = {};
	    var current = 0;
	    return function (action, app) {
	        action.app = action.app || app;
	        if (typeof action.type === "string") {
	            store.dispatch(action);
	            return;
	        }
	        var aId = action.app, aType = 0;
	        if (aId) {
	            aType = apps[aId];
	            if (!aType) {
	                current += STEP;
	                aType = apps[aId] = current;
	            }
	            action.type = aType | action.type;
	        }
	    };
	}
	exports.AppActionDispatcher = AppActionDispatcher;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Responsible for combining results of the reducers within the application to create the application's state.
	 *
	 * @export
	 * @class Combiner
	 */
	var Combiner = (function () {
	    /**
	     * Creates an instance of Combiner.
	     *
	     * @param {...Reducer[]} args (description)
	     */
	    function Combiner() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        this.reducers = {};
	        var i = 0;
	        for (i = 0; i < args.length; i++) {
	            this.addReducer(args[i]);
	        }
	    }
	    /**
	     * Create a new instance of {Combine} with the provided reducers.
	     *
	     * @static
	     * @param {...Reducer[]} args the reducers to register
	     * @returns (description)
	     */
	    Combiner.combine = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        return new (Combiner.bind.apply(Combiner, [void 0].concat(args)))();
	    };
	    Combiner.prototype.addReducer = function (r) {
	        if (typeof r === "string" && arguments.length === 2) {
	            this.reducers[r] = arguments[1];
	        }
	        else if (typeof r === "function" && r.$name) {
	            this.reducers[r.$name] = r;
	        }
	        else if (typeof r === "function" && r.name) {
	            this.reducers[r.name] = r;
	        }
	    };
	    Combiner.prototype.removeReducer = function (r) {
	        if (typeof r === "function" &&
	            r.$name && this.reducers[r.$name]) {
	            delete this.reducers[r.$name];
	        }
	        else if (typeof r === "function" &&
	            r.name && this.reducers[r.name]) {
	            delete this.reducers[r.name];
	        }
	        else if (typeof r === "string" &&
	            this.reducers[r]) {
	            delete this.reducers[r];
	        }
	    };
	    /**
	     * Invoked by an application store upon receiving a new action to generate the new application state.
	     *
	     * @param {*} state an Immutable.Map instance.
	     * @param {Action} action the action to respond to.
	     * @returns the new application state which is an instance of Immutable.Map
	     */
	    Combiner.prototype.update = function (state, action) {
	        var newState = state, key = null, reducers = this.reducers, temp2 = null, temp = null;
	        for (key in reducers) {
	            temp2 = state.get(key);
	            temp = reducers[key](temp2, action);
	            if (temp != temp2) {
	                newState = newState.set(key, temp);
	            }
	        }
	        return newState;
	    };
	    return Combiner;
	}());
	exports.Combiner = Combiner;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(5);
	var Promise = __webpack_require__(6);
	var Util_1 = __webpack_require__(7);
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
	        $inject: component.$inject || [],
	        component: component,
	    };
	    function meta() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
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
	    function onLeave(callback) {
	        route.onLeave = callback;
	        return o;
	    }
	    function onBeforeMount(fn) {
	        route.onBeforeMount = fn;
	        return o;
	    }
	    function create() {
	        if (route && route.routeDef) {
	            router.addRoute(route);
	        }
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
	        onLeave: onLeave,
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
	    "string": '([\\S]+)',
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
	        this._silent = false;
	        this._currentHash = location.hash.substr(1);
	        this._onHashChange = this._onHashChange.bind(this);
	        setTimeout(function () {
	            _this._handler.onRouteChange(_this._currentHash, '');
	        }, 0);
	        window.addEventListener('hashchange', this._onHashChange);
	    }
	    HashChangeStrategy.prototype._onHashChange = function () {
	        var _this = this;
	        if (!this._silent) {
	            // let prev = this._prevHash = this._currentHash;  
	            // let current = this._currentHash = location.hash.substr(1); 
	            var prev_1 = this._currentHash, current_1 = location.hash.substr(1);
	            this._handler.onRouteChange(current_1, prev_1).then(function () {
	                _this._prevHash = prev_1;
	                _this._currentHash = current_1;
	            }, function () {
	                _this._silent = true;
	                location.hash = '#' + _this._currentHash;
	            });
	        }
	        this._silent = false;
	    };
	    HashChangeStrategy.prototype.getCurrentRoute = function () {
	        return this._currentHash;
	    };
	    HashChangeStrategy.prototype.getPrevRoute = function () {
	        return this._prevHash;
	    };
	    HashChangeStrategy.prototype.goBack = function (silent) {
	        this._currentHash = this._prevHash;
	        this._silent = silent;
	        location.hash = '#' + this._currentHash;
	        this._silent = false;
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
	        var _this = this;
	        var i = 0, apps = this._appDefs, l = apps.length, app = null, routes = null, route = null, test = null, r = null, found = false, def = null, matches = null;
	        return new Promise(function (ok, cancel) {
	            if (_this._currentRoute && _this._currentRoute.onLeave) {
	                _this._currentRoute.onLeave(_this._currentRoute, _this._injector)
	                    .then(ok, cancel);
	                return;
	            }
	            ok();
	        }).then(function () {
	            // this._currentRoute
	            for (; i < l; i++) {
	                app = apps[i];
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
	                route.params = route.params || {};
	                var newRoute_1 = makeRouteFromMatches(route, matches);
	                if (_this._currentRoute !== route && app !== _this._currentApp) {
	                    _this._prevRoute = _this._currentRoute;
	                    _this._currentRoute = newRoute_1;
	                    route.onBeforeMount && route.onBeforeMount();
	                    _this._currentApp = app;
	                    if (app.component) {
	                        ReactDOM.unmountComponentAtNode(_this._el);
	                        var Comp = app.component;
	                        var props = makeProps(app.$inject || [], _this._injector);
	                        props.store = _this._store;
	                        _this._activeComponent = ReactDOM.render(React.createElement(app.component, props), _this._el, route.onMount);
	                    }
	                }
	                _this._store.dispatch({
	                    type: _this._actionType,
	                    data: {
	                        route: {
	                            data: route.data,
	                            params: route.params
	                        },
	                        appMeta: app.meta
	                    }
	                });
	            }
	            return 1;
	        });
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = Promise;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function repeat(str, count) {
	    var r = [];
	    var i = 0;
	    for (; i < count; i++) {
	        r.push(str);
	    }
	    return r.join("");
	}
	exports.repeat = repeat;
	function identity(v) {
	    return v;
	}
	exports.identity = identity;
	/**
	 * Extracts the names of the parameters from functions
	 *
	 * @export
	 * @param {Function} fn the function to extract its parameters' names.
	 * @returns {Array<string>} array of parameters names
	 */
	function extractArgumentsFromFunction(fn) {
	    var deps;
	    fn.toString()
	        .replace(/^function[\s]+?[\S]+?\((.*?)\)/, function (e, v, k) {
	        deps = (v.trim().length > 0 && v.trim().split(/[\s,]+/)) || [];
	        return e;
	    });
	    return deps;
	}
	exports.extractArgumentsFromFunction = extractArgumentsFromFunction;
	/**
	 * Returns value at a given key with in an object literal.
	 *
	 * @export
	 * @param {*} object the object to use
	 * @param {string} path the path to return its value
	 * @param {string} p path separator, defaults to '.'
	 * @returns {*} the value at the given key
	 */
	function getDataAt(object, path, p) {
	    var o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep);
	    while ((key = list.shift()) && (temp = o[key]) && (o = temp))
	        ;
	    return temp;
	}
	exports.getDataAt = getDataAt;
	/**
	 * (description)
	 *
	 * @export
	 * @param {*} object (description)
	 * @param {string} path (description)
	 * @param {*} value (description)
	 * @param {string} p (description)
	 * @returns {*} (description)
	 */
	function setDataAt(object, path, value, p) {
	    var o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep), lastKey = list.length > 0 ? list.splice(list.length - 1, 1)[0] : null;
	    while ((key = list.shift()) && ((temp = o[key]) || (temp = o[key] = {})) && (o = temp))
	        ;
	    temp[lastKey] = value;
	}
	exports.setDataAt = setDataAt;
	/**
	 * (description)
	 *
	 * @export
	 * @param {string} value (description)
	 * @param {*} replacements (description)
	 * @returns {string} (description)
	 */
	function format(value, replacements) {
	    if (!replacements) {
	        return value;
	    }
	    return value.replace(/\{(.*?)\}/g, function (k, e) {
	        return (replacements && replacements[e]) || k;
	    });
	}
	exports.format = format;
	/**
	 *
	 */
	var FORMATTERS = {
	    "typeof": function (item) {
	        return typeof item;
	    },
	    "d": function (item, extra) {
	        if (extra && extra.charAt(0) === ".") {
	            return item.toFixed(+extra.substr(1));
	        }
	        else if (/^[0-9]+$/.test(extra)) {
	            var len = parseInt(extra);
	            var v = item + "";
	            if (v.length < len) {
	                return repeat("0", len - v.length) + v;
	            }
	            return v;
	        }
	        else if (/^[0-9]+\.[0-9]+$/.test(extra)) {
	            var len = parseFloat(extra);
	            var v = +(((len - Math.floor(len)) + "").substr(2));
	            var k = parseInt(item);
	            var t = item.toFixed(v);
	        }
	        return item;
	    },
	    "x": function (item) {
	        return item.toString(16);
	    },
	    "o": function (item) {
	        if (typeof item === "object") {
	            if (item.toJSON) {
	                return JSON.stringify(item.toJSON());
	            }
	            return item.toString();
	        }
	        return item;
	    },
	    "s": function (item) {
	        return item;
	    }
	};
	/**
	 *
	 *
	 * @export
	 * @returns
	 */
	function createFormatter() {
	    var formats = ['[0-9]+?\.[0-9]+?d', '[0-9]+?d', '\.[0-9]+?d', 'd', 'x', 's', 'o', 'typeof'];
	    var customFormats = {};
	    function fmt(format) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var regex = new RegExp("%(" + formats.join("|") + ")");
	        var final = args.reduce(function (prev, current, cIdx) {
	            return prev.replace(regex, function (all, a) {
	                var len = a.length, f = a.charAt(len - 1);
	                return (FORMATTERS[a] && FORMATTERS[a](current)) || (customFormats[a] && customFormats[a](current)) || (FORMATTERS[f] && FORMATTERS[f](current, a.substr(0, len - 1))) || (customFormats[f] && customFormats[f](current, a.substr(0, len - 1)));
	            });
	        }, format);
	        return final;
	    }
	    return {
	        addFormat: function (f, fn) {
	            customFormats[f] = fn;
	            formats.push(f);
	        },
	        addFormatFirst: function (f, fn) {
	            customFormats[f] = fn;
	            formats.unshift(f);
	        },
	        format: fmt
	    };
	}
	exports.createFormatter = createFormatter;
	/**
	 *
	 *
	 * @export
	 * @param {string} format
	 * @param {...any[]} args
	 * @returns
	 */
	function printf(format) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    var final = args.reduce(function (prev, current, cIdx) {
	        return prev.replace(/%([0-9]+?\.[0-9]+?d|[0-9]+?d|\.[0-9]+?d|d|x|s|o|typeof)/, function (all, a) {
	            var len = a.length, f = a.charAt(len - 1);
	            return (FORMATTERS[a] && FORMATTERS[a](current)) || (FORMATTERS[f] && FORMATTERS[f](current, a.substr(0, len - 1)));
	        });
	    }, format);
	    return final;
	}
	exports.printf = printf;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Combiner_1 = __webpack_require__(2);
	var Pool_1 = __webpack_require__(9);
	var Immutable = __webpack_require__(10);
	var ChangeStatus;
	(function (ChangeStatus) {
	    ChangeStatus[ChangeStatus["PENDING"] = 1] = "PENDING";
	    ChangeStatus[ChangeStatus["EXECUTING"] = 2] = "EXECUTING";
	    ChangeStatus[ChangeStatus["FINISHED"] = 3] = "FINISHED";
	    ChangeStatus[ChangeStatus["OBSELETE"] = 4] = "OBSELETE";
	})(ChangeStatus || (ChangeStatus = {}));
	function createDispatcher() {
	    var changePool = Pool_1.createPool(function () {
	        return {
	            key: '',
	            value: null,
	            status: ChangeStatus.PENDING,
	        };
	    });
	    var changed = {};
	    var list = [];
	    var count = 0;
	    var busy = false;
	    function done() {
	        busy = false;
	        count--;
	        if (list.length > 0) {
	            exec();
	        }
	    }
	    function exec() {
	        busy = true;
	        var item = null;
	        while ((item = list.shift()) && item.status === ChangeStatus.OBSELETE) { }
	        if (item) {
	            requestAnimationFrame(function () {
	                item.status = ChangeStatus.EXECUTING;
	                item.value[0].setState(item.value[1], done);
	            });
	        }
	    }
	    function run(c, newState) {
	        var key = c.getStateKey(), objs = changed[key], obj;
	        obj = changePool.get();
	        obj.status = ChangeStatus.PENDING;
	        obj.value = [c, newState];
	        if (!objs) {
	            objs = changed[key] = [];
	        }
	        if (busy) {
	            objs = objs.filter(function (e) {
	                var ok = e.status === ChangeStatus.EXECUTING;
	                if (!ok) {
	                    e.status = ChangeStatus.OBSELETE;
	                }
	                return ok;
	            });
	            objs.push(obj);
	            list.push(obj);
	            return;
	        }
	        list.push(obj);
	        exec();
	        busy = true;
	    }
	    var o = {
	        run: run,
	    };
	    return o;
	}
	/**
	 * A {Store} component is the main component responsible for managing the application's state.
	 * Internally, the state is an instance of {Immutable.Map<string,any>}. Each {ControllerView} connects
	 * to the {Store} using a specific state key. The state key of each component is used to scope the application
	 * state into sections that are managed by different {ControllerView} components. In a StrikeJS application,
	 * there is only one Store.
	 *
	 *
	 * @export
	 * @class Store
	 */
	var Store = (function () {
	    /**
	     * Creates an instance of Store.
	     *
	     * @param {Immutable.Map<string,any>} initialState the initial state of the application. It must be an instance of {Immutable.Map}.
	     * @param {Combiner} combiner the application combiner
	     * @param {Array<Middleware>} [middleware] an array of middleware functions.
	     * @param {boolean} [trackChanges] whether to track actions or not.
	     * @param {boolean} [readiness] whether the store is ready or not.
	     */
	    function Store(opts) {
	        var v = Immutable.Map;
	        this.readyForActions = opts.ready || false;
	        this.state = opts.initialState || Immutable.Map();
	        this.combiner = Combiner_1.Combiner.combine();
	        this.middleware = opts.middlewares || [];
	        this.prevState = {};
	        this.trackChanges = opts.trackChanges || false;
	        this.prevActions = [];
	        this.components = [];
	        this.queue = [];
	        this.dispatcher = createDispatcher();
	        this.replaceStateAt = this.replaceStateAt.bind(this);
	        this.addMiddleware = this.addMiddleware.bind(this);
	        this.applyMiddleware = this.applyMiddleware.bind(this);
	        this.connect = this.connect.bind(this);
	        this.disconnect = this.disconnect.bind(this);
	        this.dispatch = this.dispatch.bind(this);
	        this.executeWithState = this.executeWithState.bind(this);
	        this.getStateAt = this.getStateAt.bind(this);
	        this.ready = this.ready.bind(this);
	    }
	    /**
	     * Connects a {ControllerView} component to the application store. Mainly three things happen here:
	     * 1. Add the {ControllerView} component to the list of components within the store.
	     * 2. Register the {ControllerView} component's Reducer with the {Combiner}.
	     * 3. Set the state at the {ControllerView} component's state key to the current state of the {ControllerView} component's state. The state is registered as an instance of {Immutable.Map<string,any>}.
	     *
	     * @param {ControllerView<any,any>} elem (description)
	     */
	    Store.prototype.connect = function (elem) {
	        var key = elem.getStateKey();
	        this.components.push(elem);
	        if (elem.getReducer) {
	            this.combiner.addReducer(key, elem.getReducer());
	        }
	        this.replaceStateAt(key, Immutable.Map(elem.state));
	    };
	    /**
	     * Add a given middleware to the list of registered middleware.
	     * Note: middlewares are executed in order, so order does matter.
	     * For example, a middleware that transforms an injectable action to a promise action,
	     * must be registered before the promisify middleware, such that the results of the injectable
	     * middleware can be handled by the promisify middlware.
	     *
	     * @param {Middleware} fn the middlware to register
	     */
	    Store.prototype.addMiddleware = function (fn) {
	        this.middleware.push(fn);
	    };
	    /**
	     * Remove a specific middlware from the list of registered middlewares.
	     * Note: the same exact function that has been registered must be passed in order for it to be removed.
	     * @param {Middleware} fn the middlware function to remove.
	     */
	    Store.prototype.removeMiddleware = function (fn) {
	        var idx = this.middleware.indexOf(fn);
	        if (idx !== -1) {
	            this.middleware.splice(idx, 1);
	        }
	    };
	    /**
	     * Dispatches the last action that has been dispatches.
	     * Note: this is only if the trackChanges flag has been set to true.
	     */
	    Store.prototype.prev = function () {
	        var action = this.prevActions.pop();
	        action && this.dispatch(action);
	    };
	    /**
	     * Get part of the application state at a given key.
	     *
	     * @param {string} key the state key to get the state at.
	     * @returns {Immutable.Map<stirng,any>}
	     */
	    Store.prototype.getStateAt = function (key) {
	        return this.state.get(key);
	    };
	    /**
	     * Get the overall application state.
	     *
	     * @returns {Immutable.Map<string,any>} (description)
	     */
	    Store.prototype.getState = function () {
	        return this.state;
	    };
	    /**
	     * Replaces part of the application at a given key.
	     *
	     * @param {string} key the key to the part of state to replace.
	     * @param {Immutable.Map<string,any>} val the new value for the specific part.
	     */
	    Store.prototype.replaceStateAt = function (key, val) {
	        this.state = this.state.set(key, val);
	    };
	    /**
	     * Deletes part of the application state at a given key.
	     *
	     * @param {string} key the key to the part of state to delete.
	     */
	    Store.prototype.deleteStateAt = function (key) {
	        this.state = this.state.delete(key);
	    };
	    /**
	     * Applies the registered middlewares to an action.
	     *
	     * @param {Action} action
	     * @returns {Action} the action that resulted from applying all the middleware functions.
	     */
	    Store.prototype.applyMiddleware = function (action) {
	        var s = this;
	        return this.middleware.reduce(function (prevVal, currentVal, idx, arr) {
	            if (!prevVal) {
	                return null;
	            }
	            return currentVal(prevVal, s);
	        }, action);
	    };
	    /**
	     * Disconnects a {ControllerView} from the application store. Three things happen here:
	     * 1. Delete the part of the state managed by the {ControllerView} component.
	     * 2. Remove the component's reducer function from the {Combiner}.
	     * 3. Remove the component from the list of registered {ControllerView} components.
	     *
	     * @param {ControllerView<any,any>} component
	     */
	    Store.prototype.disconnect = function (component) {
	        var key = component.getStateKey();
	        this.combiner.removeReducer(key);
	        this.state = this.state.delete(key);
	        var idx = this.components.indexOf(component);
	        if (idx !== -1) {
	            this.components.splice(idx, 1);
	        }
	    };
	    /**
	     * Called upon dispatching an Action within the application. The following happen here:
	     * 1. If the store is not in a ready state i.e. readyForActions is set to false, the action is added to the store's queue, and the function returns.
	     * 2. If the store is ready, the previous state is set to the current state.
	     * 3. The action is passed to the middlewares.
	     * 4. If the result of applying the middlewares is null, the function returns. Otherwise,
	     * 5. If the trackChanges flag is set to true, the action is pushed to the list of previous actions.
	     * 6. The action is then passed to the combiner along with the current application state.
	     * 7. The combiner executes all the registered reducer functions, and returns the new application state.
	     * 8. The store then loops through all the ControllerView components and only updates the ones that their state have changed.
	     *
	     * @param {Action} action (description)
	     * @returns {*} (description)
	     */
	    Store.prototype.dispatch = function (action) {
	        var _this = this;
	        if (!this.readyForActions) {
	            this.queue.push(action);
	            return;
	        }
	        this.prevState = this.state;
	        var a = this.applyMiddleware(action);
	        if (a) {
	            if (this.trackChanges) {
	                this.prevActions.push(a);
	            }
	            var prevState_1 = this.state, temp_1;
	            this.state = this.combiner.update(this.state, a);
	            var changed = [];
	            this.components.forEach(function (c) {
	                temp_1 = _this.state.get(c.getStateKey());
	                if (Immutable.Map.isMap(temp_1)) {
	                    if (temp_1 && temp_1 !== prevState_1.get(c.getStateKey())) {
	                        _this.dispatcher.run(c, temp_1.toObject());
	                    }
	                }
	                else {
	                    _this.dispatcher.run(c, temp_1);
	                }
	            });
	        }
	    };
	    Store.prototype.executeWithState = function (fn, statekeys) {
	        var st = this;
	        return fn(statekeys.map(function (e) {
	            return st.getStateAt(e);
	        }));
	    };
	    /**
	     * Sets the store to be ready to dispatch actions, and dispatches all actions that were added to the queue.
	     */
	    Store.prototype.ready = function () {
	        this.readyForActions = true;
	        var a;
	        while ((a = this.queue.shift())) {
	            this.dispatch(a);
	        }
	    };
	    /**
	     * Creates an instance of the Store class.
	     *
	     * @static
	     * @param {*} initialState (description)
	     * @param {Combiner} combiner (description)
	     * @param {Array<Middleware>} [middleware] (description)
	     * @param {boolean} [trackChanges] (description)
	     * @param {boolean} [readiness] (description)
	     * @returns (description)
	     */
	    Store.create = function (initialState, middleware, trackChanges, readiness) {
	        return new Store({
	            initialState: initialState,
	            middlewares: middleware,
	            trackChanges: trackChanges,
	            ready: readiness,
	        });
	    };
	    return Store;
	}());
	exports.Store = Store;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Creates an object for memory efficiency.
	 *
	 * @export
	 * @returns
	 */
	function createPool(createNewFn) {
	    var objects = [];
	    function get() {
	        if (objects.length > 0) {
	            return objects.shift();
	        }
	        return createNewFn();
	    }
	    function put(action) {
	        objects.push(action);
	    }
	    function destory() {
	        objects = [];
	    }
	    return {
	        get: get,
	        put: put,
	        destory: destory
	    };
	}
	exports.createPool = createPool;


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = Immutable;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * (description)
	 *
	 * @export
	 * @param {Worker} worker (description)
	 * @param {Store} store (description)
	 * @returns {Middleware} (description)
	 */
	function WorkerMiddleware(worker, store) {
	    /**
	     * (description)
	     *
	     * @param {*} e (description)
	     */
	    worker.onmessage = function (e) {
	        var action = e.data;
	        store.dispatch(action);
	    };
	    return function (action, store) {
	        if (!action.isWorker) {
	            return action;
	        }
	        worker.postMessage(action);
	        return null;
	    };
	}
	exports.WorkerMiddleware = WorkerMiddleware;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * (description)
	 *
	 * @export
	 * @template T
	 * @param {PromiseAction<T>} action (description)
	 * @param {Store} store (description)
	 * @returns {Action} (description)
	 */
	function Promisify(action, store) {
	    if (typeof action.promise === "undefined") {
	        return action;
	    }
	    action.promise.then(function (data) {
	        store.dispatch({
	            type: 'Resolved' + action.type,
	            data: data
	        });
	    }, function (data) {
	        store.dispatch({
	            type: 'Rejected' + action.type,
	            data: data
	        });
	    });
	    return {
	        type: 'Fetching' + action.type,
	        data: action.data
	    };
	}
	exports.Promisify = Promisify;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Util_1 = __webpack_require__(7);
	/**
	 * A dependency injection module inspired by AngularJS's dependency injection.
	 *
	 * @export
	 * @class Injector
	 */
	var Injector = (function () {
	    /**
	     * Creates an instance of Injector.
	     */
	    function Injector() {
	        this.components = {};
	        this.instances = {};
	        this.stack = [];
	    }
	    /**
	     * Adds an instance to the list of registered instances within the module.
	     *
	     * @param {string} name the name of the instance
	     * @param {*} c the instance, this can be a primitive, function, or an object.
	     * @returns the registered instance.
	     */
	    Injector.prototype.addInstance = function (name, c) {
	        return this.instances[name] = c;
	    };
	    /**
	     * Adds a component to the list of registered components within the module.
	     * ES6 class components should implement a static function `factory` and should include
	     * a static member `$inject` including a list of dependencies. The module will resolve the required
	     * dependencies and pass them to the static `factory` method which should return an instance of the
	     * compnent.
	     *
	     * @param {string} name the name of the component.
	     * @param {*} c the component to register
	     * @returns the component.
	     */
	    Injector.prototype.addComponent = function (name, c) {
	        return this.components[name] = c;
	    };
	    /**
	     * Checks whether a component exists or not
	     *
	     * @param {string} name the name of the component.
	     * @returns {boolean} true if the component exists false otherwise.
	     */
	    Injector.prototype.hasComponent = function (name) {
	        return this.components[name];
	    };
	    /**
	     * Checks whether an instance is registered or not.
	     *
	     * @param {string} name the name of the component.
	     * @returns {boolean} returns the instance or undefined otherwise.
	     */
	    Injector.prototype.hasInstance = function (name) {
	        return this.instances[name];
	    };
	    /**
	     * Given a function that requires access to some components, this method injects the function with the required
	     *
	     * @param {Function|ServiceFunction} fn the function to inject
	     * @param {*} [ctx] (description)
	     * @param {...any[]} args (description)
	     * @returns (description)
	     */
	    Injector.prototype.injectFunction = function (fn, ctx) {
	        var args = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            args[_i - 2] = arguments[_i];
	        }
	        if (typeof fn !== "function") {
	            throw new Error("Injector: provided argument is not a function");
	        }
	        var a, all = [], ccc = ctx || null;
	        fn.$inject = fn.$inject || Util_1.extractArgumentsFromFunction(fn);
	        if (!fn.$inject || fn.$inject.length === 0) {
	            return fn.factory ? fn.factory() : fn();
	        }
	        while ((a = fn.$inject.shift())) {
	            all.push(this.get(a));
	        }
	        return fn.factory ? fn.factory.apply(ccc, [].concat(all, Array.prototype.slice.call(args, 0))) : fn.apply(ccc, [].concat(all, Array.prototype.slice.call(args, 0)));
	    };
	    Injector.prototype._inject = function (name, c) {
	        var a, all = [];
	        if (!c.$inject || c.$inject.length === 0) {
	            return this.addInstance(name, c.factory ? c.factory() : c());
	        }
	        if (this.stack.indexOf(name) !== -1) {
	            throw new Error('Circular dependency: ' + this.stack.join(' -> ') + ' -> ' + name);
	        }
	        this.stack.push(name);
	        while ((a = c.$inject.shift())) {
	            all.push(this.get(a));
	        }
	        this.stack.pop();
	        return this.instances[name] = c.factory ? c.factory.apply(null, all) : c.apply(null, all);
	    };
	    /**
	     * (description)
	     *
	     * @param {string} name (description)
	     * @returns {*} (description)
	     */
	    Injector.prototype.get = function (name) {
	        if (this.instances[name]) {
	            return this.instances[name];
	        }
	        if (!this.components[name]) {
	            throw new Error('Component: ' + name + ' could not be found');
	        }
	        return this._inject(name, this.components[name]);
	    };
	    /**
	     * (description)
	     *
	     * @returns {Injector} (description)
	     */
	    Injector.prototype.register = function () {
	        var name, callback, deps, temp;
	        if (arguments.length === 0) {
	            throw new Error('Injector: no agruments provided.');
	        }
	        if (arguments.length === 2) {
	            if (typeof arguments[0] !== "string") {
	                throw new Error('Injector: first argument must be of type string.');
	            }
	            if (arguments[2] === null) {
	                throw new Error('Injector: second argument cannot be null');
	            }
	            name = arguments[0];
	            callback = arguments[1];
	            if (typeof callback === "string" ||
	                typeof callback === "number" ||
	                (typeof callback === "object" &&
	                    !(callback instanceof Array))) {
	                this.addInstance(name, callback);
	                return this;
	            }
	        }
	        else if (arguments.length === 1) {
	            temp = arguments[0];
	            if (typeof temp === "function") {
	                if (!temp.name) {
	                    throw new Error('Injector: anonymous functions are not supported.');
	                }
	                name = temp.name;
	                callback = temp;
	            }
	            else if (temp instanceof Array) {
	                if (typeof temp[temp.length - 1] !== "function" ||
	                    !temp[temp.length - 1].name) {
	                    throw new Error('Injector: last item in Array is not a function or function has no name.');
	                }
	                callback = temp[temp.length - 1];
	                name = callback.name;
	            }
	            else {
	                throw new Error('Injector: unknown parameter set provided');
	            }
	        }
	        callback.$inject = callback.$inject ||
	            (typeof callback.factory === "function" && Util_1.extractArgumentsFromFunction(callback.factory)) ||
	            (Util_1.extractArgumentsFromFunction(callback));
	        this.addComponent(name, callback);
	        return this;
	    };
	    return Injector;
	}());
	exports.Injector = Injector;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(4);
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


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	function IntegerPromisifer(fetching, resolved, rejected) {
	    /**
	     * (description)
	     *
	     * @export
	     * @template T
	     * @param {PromiseAction<T>} action (description)
	     * @param {Store} store (description)
	     * @returns {Action} (description)
	     */
	    return function IntegerPromisify(action, store) {
	        if (typeof action.promise === "undefined") {
	            return action;
	        }
	        action.promise.then(function (data) {
	            store.dispatch({
	                type: resolved | action.type,
	                data: data
	            });
	        }, function (data) {
	            store.dispatch({
	                type: rejected | action.type,
	                data: data
	            });
	        });
	        return {
	            type: fetching | action.type,
	            data: action.data
	        };
	    };
	}
	exports.IntegerPromisifer = IntegerPromisifer;


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Creates a middleware that can handle {PromiseAction}
	 *
	 * @export
	 * @param {Injector} injector an injector instance to use for dependency resolution.
	 * @returns {Middleware} a middleware.
	 */
	function Injectable(injector) {
	    return function (action, store) {
	        if (typeof action.service === "undefined") {
	            return action;
	        }
	        return injector.injectFunction(action.service);
	    };
	}
	exports.Injectable = Injectable;


/***/ }
/******/ ]);