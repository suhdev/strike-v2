var util = require('./lib/Util'); 


var o = {
    Combiner:require('./lib/Combiner').Combiner, 
    Store:require('./lib/Store').Store,
    Router:require('./lib/Router').Router,
    AppActionDispatcher:require('./lib/AppActionDispatcher').AppActionDispatcher,
    createPool:require('./lib/Pool').createPool,
    WorkerMiddleware:require('./lib/WorkerMiddleware').WorkerMiddleware,
    Promisify:require('./lib/PromisifyMiddleware').Promisify,
    Injector:require('./lib/Injector').Injector, 
    ControllerView:require('./lib/ControllerView').ControllerView,
    Injectable:require('./lib/InjectableMiddleware').Injectable, 
    IntegerPromisify:require('./lib/IntegerPromisifyMiddleware').IntegerPromisifer,
    printf:util.printf,
    format:util.format,
    setDataAt:util.setDataAt,
    getDataAt:util.getDataAt,
    createFormatter:util.createFormatter,
    repeat:util.repeat
}


(function(){
    if (window && document){
        window.StrikeJS = o; 
    }
}());

module.exports = o; 