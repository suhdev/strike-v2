import { Combiner } from './Combiner';
import { Store } from './Store';
import { Router } from './Router';
import { printf, setDataAt, getDataAt, createFormatter, identity, extractArgumentsFromFunction, format } from './Util';
import { Injector } from './Injector';
import { ControllerView } from './ControllerView';
import { Injectable } from './InjectableMiddleware';
import { IntegerPromisifer } from './IntegerPromisifyMiddleware';
import { Promisify } from './PromisifyMiddleware';
import { createPool } from './Pool';
import { WorkerMiddleware } from './WorkerMiddleware';
(function (global, factory) {
    if (global.module && global.module.exports) {
        global.module.exports = factory();
    }
    global.StrikeJS = factory();
})(this, function () {
    return {
        Combiner,
        Store,
        Router,
        printf,
        setDataAt,
        getDataAt,
        createFormatter,
        createPool,
        format,
        extractArgumentsFromFunction,
        identity,
        Injector,
        ControllerView,
        Injectable,
        IntegerPromisifer,
        Promisify,
        WorkerMiddleware
    };
});