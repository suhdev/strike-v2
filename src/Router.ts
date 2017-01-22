import * as React from 'react'; 
import * as ReactDOM from 'react-dom'; 
import * as Promise from 'bluebird';
import {Injector} from './Injector';
import {Dictionary,identity,getDataAt,setDataAt} from './Util'; 
import {Store} from './Store'; 

export interface RouteDef {
    routeParams:string[][];
    regex:RegExp; 
}

export interface RouteManager{
    addRoute(route:Route);
}

function makeProps($inject:string[],injector:Injector):any{
    let props = {}; 
    $inject.map((e)=>{
        props[e] = injector.get(e); 
    });
    return props;
}

export interface Route {
    routeDef:RouteDef; 
    data?:any;
    params?:Dictionary<any>;
    onMount?:(e:React.ReactElement<any>)=>void; 
    onBeforeMount?:Function; 
    onLeave?:(route:Route,injector:Injector)=>Promise<boolean>;
}

interface AppDef {
    routes:Route[]; 
    meta?:Dictionary<string>; 
    component:React.ClassType<any,any,any>;
    $inject?:string[];
    routeTest?:((route:string)=>boolean)|string|RegExp;
}

function createApplicationBuilder(router:Router,component:React.ComponentClass<any>){
    var app:AppDef = {
        routes:[],
        meta:{},
        $inject:(component as any).$inject || [],
        component:component,
    }; 
    
    function meta(...args:any[]){
        if (args.length == 2){
            app.meta[args[0]] = args[1]; 
        }else if (args.length == 1 && typeof app.meta === "object"){
            app.meta = args[0]; 
        }
        return o;
    }

    function routeTest(fn:(route:string)=>boolean){
        app.routeTest = fn; 
        return o; 
    }

    function routes(){
        return routeBuilder;
    }

    function addRoute(route:Route){
        app.routes.push(route); 
        return o; 
    }

    function attach(){
        router.attachApp(app); 
        return 
    }

    let o = {
        addRoute:addRoute,
        meta,
        routes,
        attach,
    }; 
    let routeBuilder = createRouteDefBuilder(o); 
    return o; 
}

function createRouteDefBuilder<T extends RouteManager>(router:T){
    let route:Route = {
        routeDef:null,
        params:{},
    };
    function rule(r:string){
        route.routeDef = parseRoute(r); 
        return o; 
    }

    function data(d:any){
        route.data = d; 
        return o; 
    }

    function onMount(callback:(e:React.ReactElement<any>)=>void){
        route.onMount = callback; 
        return o; 
    }

    function onLeave(callback:(route:Route,injector:Injector)=>Promise<boolean>){
        route.onLeave = callback;
        return o;
    }

    function onBeforeMount(fn:Function){
        route.onBeforeMount = fn; 
        return o;
    }

    function create(){
        if (route && route.routeDef){
            router.addRoute(route); 
        }
        return router;
    }

    function add(){
        router.addRoute(route); 
        route = {
            routeDef:null
        }; 
        return o; 
    }

    let o = {
        add,
        rule,
        data,
        onMount,
        onBeforeMount,
        onLeave,
        create,
    }; 

    return o;  
}

function makeRouteFromMatches(route:Route,matches:string[]){
    let i =0,
        def = route.routeDef, 
        params = def.routeParams, 
        l = params.length; 
    for (;i<l;i++){
        route.params[params[i][0]] = TYPES_TO_PARSE[params[i][1]](matches[i+1]); 
    }
    return route; 
}

const TYPES_TO_REGEX:Dictionary<string> = {
    "number":'([0-9]+)',
    "string":'([\\S]+)',
    "boolean":'(true|false|TRUE|FALSE)',
}

const TYPES_TO_PARSE:Dictionary<any> = {
    "number":parseFloat,
    "string":identity,
    "boolean":(v:string)=>{
        if (v.toLowerCase() === "true"){
            return true
        }
        return false;
    }
}

function parseRoute(route:string):RouteDef{
    let routeParams:string[][] = []; 
    let r = route.replace(/:([^\s\/]+):(number|string|boolean)/g,(e,k,v)=>{
        routeParams.push([k,v]); 
        return TYPES_TO_REGEX[v];
    }).replace(/:([^\s\/]+)/g,(e,k)=>{
        routeParams.push([k,"string"]); 
        return TYPES_TO_REGEX["string"]; 
    });
    return {
        routeParams:routeParams,
        regex:new RegExp("^"+r+"$","i"),
    }
}

interface ExtRouterOptions{
    strategy?:RouteChangeStrategy;
    actionType:string|number;
}

interface RouteChangeHandler {
    onRouteChange(newRoute:string,prevRoute:string);
}

interface RouteChangeStrategy{
    getCurrentRoute();
    getPrevRoute();
    destroy();
    goBack(silent?:boolean);
    setHandler(handler:RouteChangeHandler); 
}

class HashChangeStrategy implements RouteChangeStrategy{
    _prevHash:string; 
    _currentHash:string;
    _handler:RouteChangeHandler;
    _silent:boolean; 
    constructor(handler?:RouteChangeHandler){
        this._prevHash = null;
        this._handler = handler;
        this._silent = false; 
        this._currentHash = location.hash.substr(1);
        this._onHashChange = this._onHashChange.bind(this); 
        setTimeout(()=>{
            this._handler.onRouteChange(this._currentHash,'');
        },0);
        window.addEventListener('hashchange',this._onHashChange); 
    }

    _onHashChange(){
        if (!this._silent){
            // let prev = this._prevHash = this._currentHash;  
            // let current = this._currentHash = location.hash.substr(1); 
            let prev = this._currentHash,
                current = location.hash.substr(1); 
            this._handler.onRouteChange(current,prev).then(()=>{
                this._prevHash = prev;
                this._currentHash = current; 
            },()=>{
                this._silent = true; 
                location.hash = '#'+this._currentHash;
            });
        }
        this._silent = false;
        
    }

    getCurrentRoute(){
        return this._currentHash; 
    }

    getPrevRoute(){
        return this._prevHash;
    }

    goBack(silent?:boolean){
        this._currentHash = this._prevHash; 
        this._silent = silent; 
        location.hash = '#'+this._currentHash;
        this._silent = false; 
    }

    setHandler(handler:RouteChangeHandler){
        this._handler = handler;
    }

    destroy(){
        window.removeEventListener('hashchange',this._onHashChange);
    }
}


export class Router implements RouteChangeHandler{
    _el:HTMLElement; 
    _store:Store; 
    _prevRoute:Route; 
    _currentRoute:Route; 
    _injector:Injector;
    _defaultApp:AppDef; 
    _currentApp:AppDef;
    _actionType:string|number;
    _appDefs:AppDef[];
    _activeComponent:any;
    _strategy:RouteChangeStrategy; 
    constructor(el:HTMLElement,store:Store,injector:Injector,opts:ExtRouterOptions){
        this._el = el; 
        this._store = store;
        this._injector = injector;
        this._defaultApp = {
            component:null,
            routes:[],
        }; 
        this._actionType = opts.actionType; 
        this._appDefs = [this._defaultApp]; 
        this._currentRoute = null;      
        this._strategy = opts.strategy || new HashChangeStrategy(this); 
        
    }

    onRouteChange(newRoute:string,prevRoute:string):Promise<any>{
        let i=0,
            apps = this._appDefs,
            l = apps.length,
            app:AppDef = null,
            routes:Route[] = null,
            route:Route = null,
            test:any = null,
            r:RegExp = null,
            found = false, 
            def:RouteDef = null,
            matches:string[] = null; 
        return new Promise((ok,cancel)=>{
            if (this._currentRoute && this._currentRoute.onLeave){
                this._currentRoute.onLeave(this._currentRoute,this._injector)
                    .then(ok,cancel);
                return; 
            }
            ok();
            }).then(()=>{
                // this._currentRoute
                for (;i<l;i++){
                    app = apps[i];
                    routes = app.routes;
                    for(let j=0,m=routes.length;j<m;j++){
                        route = routes[j]; 
                        def = route.routeDef; 
                        r = def.regex;
                        r.lastIndex = 0; 
                        if (matches = newRoute.match(r)){
                            found = true;
                            break;
                        }
                    }
                    if (found){
                        break;
                    }
                }
                if (found){
                    route.params = route.params || {};
                    let newRoute = makeRouteFromMatches(route,matches);
                    if (this._currentRoute !== route && app !== this._currentApp){
                        this._prevRoute = this._currentRoute;
                        this._currentRoute = newRoute; 
                        route.onBeforeMount && route.onBeforeMount(); 
                        this._currentApp = app; 
                        if (app.component){
                            ReactDOM.unmountComponentAtNode(this._el); 
                            const Comp = app.component; 
                            let props = makeProps(app.$inject || [],this._injector)
                            props.store = this._store;
                            this._activeComponent = ReactDOM.render(React.createElement(app.component,props) as React.ComponentElement<any,any>,this._el,route.onMount);
                        }
                    }
                    this._store.dispatch({
                        type:this._actionType,
                        data:{
                            route:{
                                data:route.data,
                                params:route.params
                            },
                            appMeta:app.meta
                        }
                    });
                }
                return 1; 

            }); 
        
    }

    attachApp(appDef:AppDef){
        this._appDefs.push(appDef);
    }

    route(){
        return createRouteDefBuilder(this); 
    }

    addRoute(route:Route){
        this._defaultApp.routes.push(route); 
    }

    data(key?:string,val?:any){
        let cr = this._currentRoute;
        if (arguments.length > 1){
            cr && setDataAt(cr.data,key,val,'.');
            return;
        }
        return cr && getDataAt(cr.data,key,'.'); 
    }

    param(key?:string){
        return this._currentRoute && this._currentRoute.params[key]; 
    }

    register(application:React.ComponentClass<any>){
        return createApplicationBuilder(this,application);
    }

    destroy(){
        this._strategy.destroy();
    }
}
