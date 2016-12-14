"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.identity = identity;
exports.extractArgumentsFromFunction = extractArgumentsFromFunction;
exports.getDataAt = getDataAt;
exports.setDataAt = setDataAt;
exports.format = format;
exports.createFormatter = createFormatter;
exports.printf = printf;
(function () {
    if (!String.prototype.repeat) {
        String.prototype.repeat = function (count) {
            var r = [];
            var i = 0;
            for (; i < count; i++) {
                r.push(this);
            }
            return r.join("");
        };
    }
})();
function identity(v) {
    return v;
}
/**
 * Extracts the names of the parameters from functions
 *
 * @export
 * @param {Function} fn the function to extract its parameters' names.
 * @returns {Array<string>} array of parameters names
 */
function extractArgumentsFromFunction(fn) {
    var deps = void 0;
    fn.toString().replace(/^function[\s]+?[\S]+?\((.*?)\)/, function (e, v, k) {
        deps = v.trim().length > 0 && v.trim().split(/[\s,]+/) || [];
        return e;
    });
    return deps;
}
/**
 * Returns value at a given key with in an object literal.
 *
 * @export
 * @param {*} object the object to use
 * @param {string} path the path to return its value
 * @param {string} p path separator, defaults to '.'
 * @returns {*} the value at the given key
 */
function getDataAt(object, path, p) {
    var o = object,
        key = void 0,
        temp = void 0,
        pathSep = p ? p : '.',
        list = path.split(pathSep);
    while ((key = list.shift()) && (temp = o[key]) && (o = temp)) {}
    return temp;
}
/**
 * (description)
 *
 * @export
 * @param {*} object (description)
 * @param {string} path (description)
 * @param {*} value (description)
 * @param {string} p (description)
 * @returns {*} (description)
 */
function setDataAt(object, path, value, p) {
    var o = object,
        key = void 0,
        temp = void 0,
        pathSep = p ? p : '.',
        list = path.split(pathSep),
        lastKey = list.length > 0 ? list.splice(list.length - 1, 1)[0] : null;
    while ((key = list.shift()) && ((temp = o[key]) || (temp = o[key] = {})) && (o = temp)) {}
    temp[lastKey] = value;
}
/**
 * (description)
 *
 * @export
 * @param {string} value (description)
 * @param {*} replacements (description)
 * @returns {string} (description)
 */
function format(value, replacements) {
    if (!replacements) {
        return value;
    }
    return value.replace(/\{(.*?)\}/g, function (k, e) {
        return replacements && replacements[e] || k;
    });
}
/**
 *
 */
var FORMATTERS = {
    "d": function d(item, extra) {
        if (extra.charAt(0) === ".") {
            return item.toFixed(+extra.substr(1));
        } else if (/^[0-9]+$/.test(extra)) {
            var len = parseInt(extra);
            var v = item + "";
            if (v.length < len) {
                return "0".repeat(len - v.length) + v;
            }
            return v;
        } else if (/^[0-9]+\.[0-9]+$/.test(extra)) {
            var _len = parseFloat(extra);
            var _v = +(_len - Math.floor(_len) + "").substr(2);
            var k = parseInt(item);
            var t = item.toFixed(_v);
        }
        return item;
    },
    "x": function x(item) {
        return item.toString(16);
    },
    "o": function o(item) {
        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
            if (item.toJSON) {
                return JSON.stringify(item.toJSON());
            }
            return item.toString();
        }
        return item;
    },
    "s": function s(item) {
        return item;
    }
};
/**
 *
 *
 * @export
 * @returns
 */
function createFormatter() {
    var formats = ['[0-9]+?\.[0-9]+?d', '[0-9]+?d', '\.[0-9]+?d', 'd', 'x', 's', 'o'];
    var customFormats = {};
    function fmt(format) {
        var regex = new RegExp("%(" + formats.join("|") + ")");

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key = 1; _key < _len2; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var final = args.reduce(function (prev, current, cIdx) {
            return prev.replace(regex, function (all, a) {
                var len = a.length,
                    f = a.charAt(len - 1),
                    fn = FORMATTERS[f] || customFormats[f];
                return fn(current, a.substr(0, len - 1));
            });
        }, format);
        return final;
    }
    return {
        addFormat: function addFormat(f, fn) {
            customFormats[f] = fn;
            formats.push(f);
        },
        addFormatFirst: function addFormatFirst(f, fn) {
            customFormats[f] = fn;
            formats.unshift(f);
        },

        format: fmt
    };
}
/**
 *
 *
 * @export
 * @param {string} format
 * @param {...any[]} args
 * @returns
 */
function printf(format) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key2 = 1; _key2 < _len3; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    var final = args.reduce(function (prev, current, cIdx) {
        return prev.replace(/%([0-9]+?\.[0-9]+?d|[0-9]+?d|\.[0-9]+?d|d|x|s|o)/, function (all, a) {
            var len = a.length,
                f = a.charAt(len - 1);
            return FORMATTERS[f](current, a.substr(0, len - 1));
        });
    }, format);
    return final;
}