"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createStore;

var _utils = require("./utils");

var _ = _interopRequireWildcard(_utils);

var _Keep = require("./Keep");

var _Keep2 = _interopRequireDefault(_Keep);

var _mixer = require("./mixer");

var _mixer2 = _interopRequireDefault(_mixer);

var _bindMethods = require("./bindMethods");

var _StoreMethods = require("./StoreMethods");

var _StoreMethods2 = _interopRequireDefault(_StoreMethods);

var _PublisherMethods = require("./PublisherMethods");

var _PublisherMethods2 = _interopRequireDefault(_PublisherMethods);

var _ListenerMethods = require("./ListenerMethods");

var _ListenerMethods2 = _interopRequireDefault(_ListenerMethods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var allowed = { preEmit: 1, shouldEmit: 1 };

/**
 * Creates an event emitting Data Store. It is mixed in with functions
 * from the `ListenerMethods` and `PublisherMethods` mixins. `preEmit`
 * and `shouldEmit` may be overridden in the definition object.
 *
 * @param {Object} definition The data store object definition
 * @returns {Store} A data store instance
 */
function createStore(definition) {

    definition = definition || {};

    for (var a in _StoreMethods2.default) {
        if (!allowed[a] && (_PublisherMethods2.default[a] || _ListenerMethods2.default[a])) {
            throw new Error("Cannot override API method " + a + " in Reflux.StoreMethods. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead.");
        }
    }

    for (var d in definition) {
        if (!allowed[d] && (_PublisherMethods2.default[d] || _ListenerMethods2.default[d])) {
            throw new Error("Cannot override API method " + d + " in store creation. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead.");
        }
    }

    definition = (0, _mixer2.default)(definition);

    function Store() {
        var i = 0,
            arr;
        this.subscriptions = [];
        this.emitter = new _.EventEmitter();
        this.eventLabel = "change";
        (0, _bindMethods.bindMethods)(this, definition);
        if (this.init && _.isFunction(this.init)) {
            this.init();
        }
        if (this.listenables) {
            arr = [].concat(this.listenables);
            for (; i < arr.length; i++) {
                this.listenToMany(arr[i]);
            }
        }
    }

    _.extend(Store.prototype, _ListenerMethods2.default, _PublisherMethods2.default, _StoreMethods2.default, definition);

    var store = new Store();
    _Keep2.default.createdStores.push(store);

    return store;
}