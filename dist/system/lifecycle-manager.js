System.register(['./flux-dispatcher', './metadata', './symbols', 'bluebird', 'aurelia-router'], function (_export) {
    'use strict';

    var FluxDispatcher, Metadata, Symbols, Promise, activationStrategy, LifecycleManager;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_fluxDispatcher) {
            FluxDispatcher = _fluxDispatcher.FluxDispatcher;
        }, function (_metadata) {
            Metadata = _metadata.Metadata;
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }, function (_bluebird) {
            Promise = _bluebird['default'];
        }, function (_aureliaRouter) {
            activationStrategy = _aureliaRouter.activationStrategy;
        }],
        execute: function () {
            LifecycleManager = (function () {
                function LifecycleManager() {
                    _classCallCheck(this, LifecycleManager);
                }

                LifecycleManager.interceptInstanceDeactivators = function interceptInstanceDeactivators(instance) {
                    if (instance[Symbols.deactivators] === true) {
                        return;
                    }

                    LifecycleManager.interceptInstanceDeactivate(instance);
                    LifecycleManager.interceptInstanceDetached(instance);

                    instance[Symbols.deactivators] = true;
                };

                LifecycleManager.interceptInstanceDeactivate = function interceptInstanceDeactivate(instance) {

                    function _unregister() {
                        if (FluxDispatcher.instance.strategy !== activationStrategy.invokeLifecycle) {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                        }
                    }

                    if (instance.deactivate !== undefined) {
                        var deactivateImpl = instance.deactivate;
                        instance.deactivate = function () {
                            _unregister();

                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                            }

                            deactivateImpl.apply(instance, args);
                        };
                    } else {
                        instance.deactivate = function () {
                            _unregister();
                        };
                    }
                };

                LifecycleManager.interceptInstanceDetached = function interceptInstanceDetached(instance) {
                    if (instance.detached !== undefined) {
                        var deactivateImpl = instance.detached;
                        instance.detached = function () {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);

                            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                args[_key2] = arguments[_key2];
                            }

                            deactivateImpl.apply(instance, args);
                        };
                    } else {
                        instance.detached = function () {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                        };
                    }
                };

                return LifecycleManager;
            })();

            _export('LifecycleManager', LifecycleManager);
        }
    };
});