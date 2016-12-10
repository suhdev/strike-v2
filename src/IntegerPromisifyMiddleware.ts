import {Middleware} from './Middleware';
import {PromiseAction, Action} from './Action';
import {Store} from './Store';

export const PROMISE_FETCHING = 0x1000000;
export const PROMISE_RESOLVED = 0x2000000;
export const PROMISE_REJECTED = 0x4000000;
export const PROMISE_NOTIFY   = 0x8000000;
/**
 * (description)
 * 
 * @export
 * @template T
 * @param {PromiseAction<T>} action (description)
 * @param {Store} store (description)
 * @returns {Action} (description)
 */
export function IntegerPromisify<T>(action: PromiseAction<T>, store: Store): Action {
	if (typeof action.promise === "undefined") {
		return action;
	}
	action.promise.then(function(data: T) {
		store.dispatch({
			type: PROMISE_RESOLVED | action.type as number,
			data: data
		});
	}, function(data: any) {
		store.dispatch({
			type: PROMISE_REJECTED | action.type as number,
			data: data
		})
	});
	return {
		type: PROMISE_FETCHING | <number>action.type,
		data: action.data
	};
}