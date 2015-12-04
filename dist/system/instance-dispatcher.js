System.register(['./metadata', './utils', './flux-dispatcher', 'bluebird', './symbols', './lifecycle-manager'], function (_export) {
    'use strict';

    var Metadata, Utils, FluxDispatcher, Promise, Symbols, LifecycleManager, Handler, Dispatcher;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_metadata) {
            Metadata = _metadata.Metadata;
        }, function (_utils) {
            Utils = _utils.Utils;
        }, function (_fluxDispatcher) {
            FluxDispatcher = _fluxDispatcher.FluxDispatcher;
        }, function (_bluebird) {
            Promise = _bluebird['default'];
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }, function (_lifecycleManager) {
            LifecycleManager = _lifecycleManager.LifecycleManager;
        }],
        execute: function () {
            Handler = function Handler(regexp, handler) {
                _classCallCheck(this, Handler);

                this.regexp = regexp;
                this['function'] = handler;
            };

            Dispatcher = (function () {
                function Dispatcher() {
                    _classCallCheck(this, Dispatcher);

                    this.handlers = new Set();
                }

                Dispatcher.prototype.connect = function connect(instance) {
                    if (Metadata.exists(Object.getPrototypeOf(instance))) {
                        this.instance = instance;
                        instance[Symbols.instanceDispatcher] = this;
                        LifecycleManager.interceptInstanceDeactivators(instance);

                        this.registerMetadata();
                        FluxDispatcher.instance.registerInstanceDispatcher(this);
                    }
                };

                Dispatcher.prototype.handle = function handle(patterns, callback) {
                    var _this = this;

                    var handler = new Handler(Utils.patternsToRegex(patterns), callback);
                    this.handlers.add(handler);

                    return function () {
                        _this.handlers['delete'](handler);
                    };
                };

                Dispatcher.prototype.waitFor = function waitFor(types, handler) {
                    FluxDispatcher.instance.waitFor(types, handler);
                };

                Dispatcher.prototype.dispatch = function dispatch(action) {
                    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        payload[_key - 1] = arguments[_key];
                    }

                    FluxDispatcher.instance.dispatch(action, payload);
                };

                Dispatcher.prototype.dispatchOwn = function dispatchOwn(action, payload) {
                    var _this2 = this;

                    var promises = [];

                    this.handlers.forEach(function (handler) {
                        if (handler.regexp.test(action)) {
                            promises.push(Promise.resolve(handler['function'].apply(_this2.instance, [action].concat(payload))));
                        }
                    });

                    return Promise.settle(promises);
                };

                Dispatcher.prototype.registerMetadata = function registerMetadata() {
                    var _this3 = this;

                    var metadata = Metadata.getOrCreateMetadata(Object.getPrototypeOf(this.instance));

                    metadata.awaiters.forEach(function (types, methodName) {
                        if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                            var methodImpl = _this3.instance[methodName];
                            _this3.instance[methodName] = function () {
                                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                    args[_key2] = arguments[_key2];
                                }

                                return FluxDispatcher.instance.waitFor(types, function () {
                                    methodImpl.apply(_this3.instance, args);
                                });
                            };
                        }
                    });

                    metadata.handlers.forEach(function (patterns, methodName) {
                        if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                            _this3.handlers.add(new Handler(Utils.patternsToRegex(patterns), _this3.instance[methodName]));
                        }
                    });
                };

                return Dispatcher;
            })();

            _export('Dispatcher', Dispatcher);
        }
    };
});