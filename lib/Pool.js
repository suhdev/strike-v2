"use strict";
/**
 * Creates an object for memory efficiency.
 *
 * @export
 * @returns
 */
function createPool(createNewFn) {
    var objects = [];
    function get() {
        if (objects.length > 0) {
            return objects.shift();
        }
        return createNewFn();
    }
    function put(action) {
        objects.push(action);
    }
    function destory() {
        objects = [];
    }
    return {
        get: get,
        put: put,
        destory: destory
    };
}
exports.createPool = createPool;
