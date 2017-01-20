"use strict";
var AppActionDispatcher_1 = require("./AppActionDispatcher");
var Combiner_1 = require("./Combiner");
var Router_1 = require("./Router");
var Store_1 = require("./Store");
var WorkerMiddleware_1 = require("./WorkerMiddleware");
var PromisifyMiddleware_1 = require("./PromisifyMiddleware");
var Injector_1 = require("./Injector");
var ControllerView_1 = require("./ControllerView");
var IntegerPromisifyMiddleware_1 = require("./IntegerPromisifyMiddleware");
var Util_1 = require("./Util");
var InjectableMiddleware_1 = require("./InjectableMiddleware");
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
