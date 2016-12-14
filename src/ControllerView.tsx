import * as React from 'react';
import {Action} from './Action'; 
import {Store,DispatchFn} from './Store';
import {Reducer} from './Reducer';
import * as Immutable from 'immutable';  
/**
 * Default properties of {ControllerView} components
 * 
 * @export
 * @interface ControllerViewProps
 */
export interface ControllerViewProps {
	/**
	 * (description)
	 * 
	 * @type {Store}
	 */
	store:Store;
}
/**
 * A {ControllerView} is a ReactJS component that manages a specific space of the application state. 
 * It is responsible for passing that part of the application state to other stateless/stateful components. 
 * All components that requires access to the application state store must extends this class. 
 * 
 * @export
 * @class ControllerView
 * @extends {Component<T, V>}
 * @template T any object that extends/implements {ControllerViewProps}
 * @template V
 */
export class ControllerView<T extends ControllerViewProps,V> extends React.Component<T,V> {
	/**
	 * The application state store
	 * 
	 * @type {Store}
	 */
	$$store: Store;
	/**
	 * The key to address the component's space in the application state. 
	 * 
	 * @type {string}
	 */
	$$stateKey: string;
	/**
	 * The component's reducer function.
	 * 
	 * @type {Reducer}
	 */
	$$reducer:Reducer;
	/**
	 * Creates an instance of ControllerView.
	 * 
	 * @param {T} props the properties of the component
	 * @param {string} stateKey the key to address the component's space in the application state. 
	 * @param {*} initialState the initial state of the components, this is also passed to the store upon mounting. 
	 * @param {Reducer} reducer the reducer function of the component, this is also passed to the store upon mounting. 
	 */
	dispatch:DispatchFn<any>;
	constructor(props:T,stateKey:string,
		initialState:any,reducer:Reducer){
		super(props);
		this.state = initialState; 
		this.$$store = props.store; 
		this.dispatch = this.$$store.dispatch; 
		this.$$stateKey = stateKey;
		this.$$reducer = reducer;
	}

	/**
	 * Returns the component's reducer function 
	 * 
	 * @returns the component's {Reducer} 
	 */
	getReducer(){
		return this.$$reducer;
	}

	/**
	 * Returns the component's state key.
	 * 
	 * @returns {string} the component's state key.
	 */
	getStateKey():string{
		return this.$$stateKey;
	}

	/**
	 * To be called when the component is first mounted to connect the component to the application store. 
	 * Note: if this method is overriden in the child class, the child class must call `super.componentDidMount()` 
	 */
	componentDidMount():void{
		this.$$store.connect(this);
	}

	/**
	 * To be called before the component is unmounted to disconnect the component from the application store. 
	 * Note: if this method is overriden in the child class, the child class must call `super.componentWillUnmount()`
	 */
	componentWillUnmount(){
		this.$$store.disconnect(this);
	}
}