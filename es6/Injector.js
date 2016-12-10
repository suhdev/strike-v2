'use strict';
import { extractArgumentsFromFunction } from './Util';
/**
 * A dependency injection module inspired by AngularJS's dependency injection.
 *
 * @export
 * @class Injector
 */
export class Injector {
    /**
     * Creates an instance of Injector.
     */
    constructor() {
        this.components = {};
        this.instances = {};
        this.stack = [];
    }
    /**
     * Adds an instance to the list of registered instances within the module.
     *
     * @param {string} name the name of the instance
     * @param {*} c the instance, this can be a primitive, function, or an object.
     * @returns the registered instance.
     */
    addInstance(name, c) {
        return this.instances[name] = c;
    }
    /**
     * Adds a component to the list of registered components within the module.
     * ES6 class components should implement a static function `factory` and should include
     * a static member `$inject` including a list of dependencies. The module will resolve the required
     * dependencies and pass them to the static `factory` method which should return an instance of the
     * compnent.
     *
     * @param {string} name the name of the component.
     * @param {*} c the component to register
     * @returns the component.
     */
    addComponent(name, c) {
        return this.components[name] = c;
    }
    /**
     * Checks whether a component exists or not
     *
     * @param {string} name the name of the component.
     * @returns {boolean} true if the component exists false otherwise.
     */
    hasComponent(name) {
        return this.components[name];
    }
    /**
     * Checks whether an instance is registered or not.
     *
     * @param {string} name the name of the component.
     * @returns {boolean} returns the instance or undefined otherwise.
     */
    hasInstance(name) {
        return this.instances[name];
    }
    /**
     * Given a function that requires access to some components, this method injects the function with the required
     *
     * @param {Function|ServiceFunction} fn the function to inject
     * @param {*} [ctx] (description)
     * @param {...any[]} args (description)
     * @returns (description)
     */
    injectFunction(fn, ctx, ...args) {
        if (typeof fn !== "function") {
            throw new Error("Injector: provided argument is not a function");
        }
        let a, all = [], ccc = ctx || null;
        fn.$inject = fn.$inject || extractArgumentsFromFunction(fn);
        if (!fn.$inject || fn.$inject.length === 0) {
            return fn.factory ? fn.factory() : fn();
        }
        while ((a = fn.$inject.shift())) {
            all.push(this.get(a));
        }
        return fn.factory ? fn.factory.apply(ccc, [].concat(all, Array.prototype.slice.call(args, 0))) : fn.apply(ccc, [].concat(all, Array.prototype.slice.call(args, 0)));
    }
    _inject(name, c) {
        let a, all = [];
        if (!c.$inject || c.$inject.length === 0) {
            return this.addInstance(name, c.factory ? c.factory() : c());
        }
        if (this.stack.indexOf(name) !== -1) {
            throw new Error('Circular dependency: ' + this.stack.join(' -> ') + ' -> ' + name);
        }
        this.stack.push(name);
        while ((a = c.$inject.shift())) {
            all.push(this.get(a));
        }
        this.stack.pop();
        return this.instances[name] = c.factory ? c.factory.apply(null, all) : c.apply(null, all);
    }
    /**
     * (description)
     *
     * @param {string} name (description)
     * @returns {*} (description)
     */
    get(name) {
        if (this.instances[name]) {
            return this.instances[name];
        }
        if (!this.components[name]) {
            throw new Error('Component: ' + name + ' could not be found');
        }
        return this._inject(name, this.components[name]);
    }
    /**
     * (description)
     *
     * @returns {Injector} (description)
     */
    register() {
        let name, callback, deps, temp;
        if (arguments.length === 0) {
            throw new Error('Injector: no agruments provided.');
        }
        if (arguments.length === 2) {
            if (typeof arguments[0] !== "string") {
                throw new Error('Injector: first argument must be of type string.');
            }
            if (arguments[2] === null) {
                throw new Error('Injector: second argument cannot be null');
            }
            name = arguments[0];
            callback = arguments[1];
            if (typeof callback === "string" ||
                typeof callback === "number" ||
                (typeof callback === "object" &&
                    !(callback instanceof Array))) {
                this.addInstance(name, callback);
                return this;
            }
        }
        else if (arguments.length === 1) {
            temp = arguments[0];
            if (typeof temp === "function") {
                if (!temp.name) {
                    throw new Error('Injector: anonymous functions are not supported.');
                }
                name = temp.name;
                callback = temp;
            }
            else if (temp instanceof Array) {
                if (typeof temp[temp.length - 1] !== "function" ||
                    !temp[temp.length - 1].name) {
                    throw new Error('Injector: last item in Array is not a function or function has no name.');
                }
                callback = temp[temp.length - 1];
                name = callback.name;
            }
            else {
                throw new Error('Injector: unknown parameter set provided');
            }
        }
        callback.$inject = callback.$inject ||
            (typeof callback.factory === "function" && extractArgumentsFromFunction(callback.factory)) ||
            (extractArgumentsFromFunction(callback));
        this.addComponent(name, callback);
        return this;
    }
}
export default Injector;
