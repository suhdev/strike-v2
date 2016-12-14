"use strict";
var Combiner_1 = require('./Combiner');
var Store_1 = require('./Store');
var Router_1 = require('./Router');
var Util_1 = require('./Util');
var Injector_1 = require('./Injector');
var ControllerView_1 = require('./ControllerView');
var InjectableMiddleware_1 = require('./InjectableMiddleware');
var IntegerPromisifyMiddleware_1 = require('./IntegerPromisifyMiddleware');
var PromisifyMiddleware_1 = require('./PromisifyMiddleware');
var Pool_1 = require('./Pool');
var WorkerMiddleware_1 = require('./WorkerMiddleware');
(function (global, factory) {
    if (global.module && global.module.exports) {
        global.module.exports = factory();
    }
    global.StrikeJS = factory();
}(this, function () {
    return {
        Combiner: Combiner_1.Combiner,
        Store: Store_1.Store,
        Router: Router_1.Router,
        printf: Util_1.printf,
        setDataAt: Util_1.setDataAt,
        getDataAt: Util_1.getDataAt,
        createFormatter: Util_1.createFormatter,
        createPool: Pool_1.createPool,
        format: Util_1.format,
        extractArgumentsFromFunction: Util_1.extractArgumentsFromFunction,
        identity: Util_1.identity,
        Injector: Injector_1.Injector,
        ControllerView: ControllerView_1.ControllerView,
        Injectable: InjectableMiddleware_1.Injectable,
        IntegerPromisifer: IntegerPromisifyMiddleware_1.IntegerPromisifer,
        Promisify: PromisifyMiddleware_1.Promisify,
        WorkerMiddleware: WorkerMiddleware_1.WorkerMiddleware,
    };
}));
