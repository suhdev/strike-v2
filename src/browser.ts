import {Action,PromiseAction,ServiceAction} from './Action'; 
import {Combiner} from './Combiner'; 
import {Store,StoreOptions,DispatchFn} from './Store';
import {Router} from './Router';
import {StatefulComponent} from './StatefulComponent'; 
import {printf,setDataAt,getDataAt,createFormatter,identity,extractArgumentsFromFunction,format} from './Util';
import {Injector} from './Injector'; 
import {ControllerView,ControllerViewProps} from './ControllerView'; 
import {Injectable} from './InjectableMiddleware';
import {IntegerPromisifer} from './IntegerPromisifyMiddleware';
import {Promisify} from './PromisifyMiddleware'; 
import {Reducer} from './Reducer'; 
import {createPool} from './Pool'; 
import {WorkerMiddleware,WorkerAction} from './WorkerMiddleware';

(function(global,factory){
    if (global.module && global.module.exports){
        global.module.exports = factory(); 
    }
    global.StrikeJS = factory();
}(this,function(){
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
            WorkerMiddleware,
        };
}))