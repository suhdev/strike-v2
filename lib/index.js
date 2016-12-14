'use strict';

var _Combiner = require('./Combiner');

var _Store = require('./Store');

var _Router = require('./Router');

var _Util = require('./Util');

var _Injector = require('./Injector');

var _ControllerView = require('./ControllerView');

var _InjectableMiddleware = require('./InjectableMiddleware');

var _IntegerPromisifyMiddleware = require('./IntegerPromisifyMiddleware');

var _PromisifyMiddleware = require('./PromisifyMiddleware');

var _Pool = require('./Pool');

var _WorkerMiddleware = require('./WorkerMiddleware');

(function (global, factory) {
    if (global.module && global.module.exports) {
        global.module.exports = factory();
    }
    global.StrikeJS = factory();
})(undefined, function () {
    return {
        Combiner: _Combiner.Combiner,
        Store: _Store.Store,
        Router: _Router.Router,
        printf: _Util.printf,
        setDataAt: _Util.setDataAt,
        getDataAt: _Util.getDataAt,
        createFormatter: _Util.createFormatter,
        createPool: _Pool.createPool,
        format: _Util.format,
        extractArgumentsFromFunction: _Util.extractArgumentsFromFunction,
        identity: _Util.identity,
        Injector: _Injector.Injector,
        ControllerView: _ControllerView.ControllerView,
        Injectable: _InjectableMiddleware.Injectable,
        IntegerPromisifer: _IntegerPromisifyMiddleware.IntegerPromisifer,
        Promisify: _PromisifyMiddleware.Promisify,
        WorkerMiddleware: _WorkerMiddleware.WorkerMiddleware
    };
});