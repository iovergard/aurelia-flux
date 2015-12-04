define(['exports', './flux-dispatcher', './metadata', './symbols', 'bluebird', 'aurelia-router'], function (exports, _fluxDispatcher, _metadata, _symbols, _bluebird, _aureliaRouter) {
    'use strict';

    exports.__esModule = true;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _Promise = _interopRequireDefault(_bluebird);

    var LifecycleManager = (function () {
        function LifecycleManager() {
            _classCallCheck(this, LifecycleManager);
        }

        LifecycleManager.interceptInstanceDeactivators = function interceptInstanceDeactivators(instance) {
            if (instance[_symbols.Symbols.deactivators] === true) {
                return;
            }

            LifecycleManager.interceptInstanceDeactivate(instance);
            LifecycleManager.interceptInstanceDetached(instance);

            instance[_symbols.Symbols.deactivators] = true;
        };

        LifecycleManager.interceptInstanceDeactivate = function interceptInstanceDeactivate(instance) {

            function _unregister() {
                if (_fluxDispatcher.FluxDispatcher.instance.strategy !== _aureliaRouter.activationStrategy.invokeLifecycle) {
                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
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
                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);

                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    deactivateImpl.apply(instance, args);
                };
            } else {
                instance.detached = function () {
                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
                };
            }
        };

        return LifecycleManager;
    })();

    exports.LifecycleManager = LifecycleManager;
});