"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Responsible for combining results of the reducers within the application to create the application's state.
 *
 * @export
 * @class Combiner
 */
var Combiner = exports.Combiner = function () {
    /**
     * Creates an instance of Combiner.
     *
     * @param {...Reducer[]} args (description)
     */
    function Combiner() {
        _classCallCheck(this, Combiner);

        this.reducers = {};
        var i = 0;
        for (i = 0; i < arguments.length; i++) {
            this.addReducer(arguments.length <= i ? undefined : arguments[i]);
        }
    }
    /**
     * Create a new instance of {Combine} with the provided reducers.
     *
     * @static
     * @param {...Reducer[]} args the reducers to register
     * @returns (description)
     */


    _createClass(Combiner, [{
        key: "addReducer",
        value: function addReducer(r) {
            if (typeof r === "string" && arguments.length === 2) {
                this.reducers[r] = arguments[1];
            } else if (typeof r === "function" && r.$name) {
                this.reducers[r.$name] = r;
            } else if (typeof r === "function" && r.name) {
                this.reducers[r.name] = r;
            }
        }
    }, {
        key: "removeReducer",
        value: function removeReducer(r) {
            if (typeof r === "function" && r.$name && this.reducers[r.$name]) {
                delete this.reducers[r.$name];
            } else if (typeof r === "function" && r.name && this.reducers[r.name]) {
                delete this.reducers[r.name];
            } else if (typeof r === "string" && this.reducers[r]) {
                delete this.reducers[r];
            }
        }
        /**
         * Invoked by an application store upon receiving a new action to generate the new application state.
         *
         * @param {*} state an Immutable.Map instance.
         * @param {Action} action the action to respond to.
         * @returns the new application state which is an instance of Immutable.Map
         */

    }, {
        key: "update",
        value: function update(state, action) {
            var newState = state,
                key = null,
                reducers = this.reducers,
                temp2 = null,
                temp = null;
            for (key in reducers) {
                temp2 = state.get(key);
                temp = reducers[key](temp2, action);
                if (temp != temp2) {
                    newState = newState.set(key, temp);
                }
            }
            return newState;
        }
    }], [{
        key: "combine",
        value: function combine() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(Combiner, [null].concat(args)))();
        }
    }]);

    return Combiner;
}();