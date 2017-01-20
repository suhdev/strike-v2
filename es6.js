export {AppActionDispatcher} from './es6/AppActionDispatcher';
export {Combiner} from './es6/Combiner';
export {Router} from './es6/Router';
export {Store} from './es6/Store';
export {createPool} from './es6/Pool';
export {WorkerMiddleware} from './es6/WorkerMiddleware';
export {Promisify} from './es6/PromisifyMiddleware';
export {Injector} from './es6/Injector';
export {ControllerView} from './es6/ControllerView';
export {IntegerPromisify} from './es6/IntegerPromisifyMiddleware';
export {printf,format,setDataAt,getDataAt,createFormatter} from './es6/Util';
export {Injectable} from './es6/InjectableMiddleware';

(function(){
    if (window && document){
        window.StrikeJS = {
            AppActionDispatcher,
            Combiner,
            Router,
            Store,
            WorkerMiddleware,
            Promisify,
            IntegerPromisify,
            printf,
            format,
            setDataAt,
            getDataAt,
            createFormatter,
            Injectable
        }
    }
}());