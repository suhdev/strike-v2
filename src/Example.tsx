import * as React from 'react'; 
import * as ReactDOM from 'react-dom'; 
import {Store} from './Store'; 
import {ControllerView,ControllerViewProps} from './ControllerView'; 
import {Action} from './Action'; 
import {Injector} from './Injector'; 
import * as Immutable from 'immutable';
import {Router} from './Router'; 

interface Example1Props extends ControllerViewProps {

}

interface Example1State {
    id?:number;
}


interface Example2Props extends ControllerViewProps {

}

interface Example2State {
    index?:string;
}

function reduce1(state:Immutable.Map<string,any>,action:Action){
    let newState = state;
    switch(action.type){
        case 0xFF000001:
        newState = newState.set('id',action.data.route.params.id); 
        break;
        case 1:
        newState = newState.set('id',newState.get('id')+action.data); 
        break;
    }
    return newState; 
}

function reduce2(state:Immutable.Map<string,any>,action:Action){
    let newState = state;
    switch(action.type){
        case 0xFF000001:
        newState = newState.set('index',action.data.route.params.id); 
        break;
        case 1:
        newState = newState.set('id',newState.get('id')-action.data); 
        break;
    }
    return newState; 
}

export class Example1 extends ControllerView<Example1Props,Example1State> {
    constructor(props:Example1Props){
        super(props,'example',{},reduce1); 
        this.onCountClick = this.onCountClick.bind(this); 
    }

    onCountClick(){
        this.dispatch({
            type:0x0001, 
            data:2
        });
    }

    render(){
        let state = this.state; 
        return (
            <div className="example-1" data-type="1"><div className="btn" onClick={this.onCountClick}>Count: {state.id} </div></div>
        );
    }
}

export class Example2 extends ControllerView<Example2Props,Example2State> {
    constructor(props:Example2Props){
        super(props,'example2',{},reduce2); 
    }

    render(){
        let state = this.state; 
        return (
            <div className="example-2" data-type="2">This is just a test. {state.index} </div>
        );
    }
}


(function (){
    let injector = new Injector(); 
    let store = new Store({
        ready:true,
        trackChanges:false,
        initialState:Immutable.Map<string,any>(),
        middlewares:[]
    }); 
    injector.addInstance('store',store); 
    let router = new Router(document.getElementById('ViewPort'),store,injector,{
        actionType:0xFF000001,
    }); 
    injector.addInstance('router',router);
    router.register(Example1)
        .meta('name','Example 1')
        .meta('id',0x00001)
        .routes()
            .rule('task/:id:number')
            .data({firstName:'Suhail',lastName:'Abood'})
            .add()
            .rule('task/:userId')
            .data({firstName:'Yaman', lastName:'Al-Kamaly'})
            .create()
        .attach();
    router.register(Example2)
        .meta('name','Example 2')
        .meta('id',0x00002)
        .routes()
            .rule('note/:id:number')
            .data({firstName:'Najm',lastName:'Abood'})
            .add()
            .rule('note/:userId')
            .data({firstName:'Dergham', lastName:'Al-Kamaly'})
            .create()
        .attach();

}())