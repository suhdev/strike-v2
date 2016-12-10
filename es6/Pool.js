/**
 * Creates an object for memory efficiency.
 *
 * @export
 * @returns
 */
export function createPool(createNewFn) {
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
        get,
        put,
        destory
    };
}
