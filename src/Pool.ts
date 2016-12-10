import {Action} from './Action'; 
/**
 * Creates an object for memory efficiency. 
 * 
 * @export
 * @returns
 */
export function createPool<T>(createNewFn:()=>T){
    var objects:T[] = []; 

    function get():T{
        if (objects.length > 0){
            return objects.shift(); 
        }

        return createNewFn();
    }

    function put(action:T){
        objects.push(action); 
    }

    function destory(){
        objects = [];
    }

    return {
        get,
        put,
        destory
    } 
}