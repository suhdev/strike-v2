import {Store} from './Store'; 
import {Action} from './Action'; 
export function AppActionDispatcher(store:Store){
    const STEP = 0x01000000; 
    let apps = {}; 
    let current = 0; 

    return function(action:Action,app:string){
        action.app = action.app || app; 
        if (typeof action.type === "string"){
            store.dispatch(action);
            return; 
        }
        let aId = action.app, 
            aType = 0; 
        if (aId){
            aType = apps[aId]; 
            if (!aType){
                current += STEP; 
                aType = apps[aId] = current; 
            }
            action.type = aType | (action.type as number); 
        }
    }
}