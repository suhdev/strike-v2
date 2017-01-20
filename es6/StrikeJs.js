import { AppActionDispatcher } from './AppActionDispatcher';
import { Combiner } from './Combiner';
import { Router } from './Router';
import { Store } from './Store';
import { WorkerMiddleware } from './WorkerMiddleware';
import { Promisify } from './PromisifyMiddleware';
import { Injector } from './Injector';
import { ControllerView } from './ControllerView';
import { IntegerPromisifer } from './IntegerPromisifyMiddleware';
import { printf, format, setDataAt, getDataAt, createFormatter } from './Util';
import { Injectable } from './InjectableMiddleware';
(function () {
    if (window && document) {
        window.StrikeJS = {
            AppActionDispatcher,
            Combiner,
            Router,
            Store,
            WorkerMiddleware,
            ControllerView,
            Injector,
            Promisify,
            IntegerPromisifer,
            printf,
            format,
            setDataAt,
            getDataAt,
            createFormatter,
            Injectable
        };
    }
}());
