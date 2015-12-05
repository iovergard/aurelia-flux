define(['exports', 'aurelia-dependency-injection', './instance-dispatcher', './metadata', './symbols'], function (exports, _aureliaDependencyInjection, _instanceDispatcher, _metadata, _symbols) {
    'use strict';

    exports.__esModule = true;
    exports.handlerCreationCb = handlerCreationCb;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var DispatcherResolver = (function () {
        function DispatcherResolver() {
            _classCallCheck(this, _DispatcherResolver);
        }

        DispatcherResolver.prototype.get = function get(container) {
            return container._lastDispatcher = new _instanceDispatcher.Dispatcher();
        };

        var _DispatcherResolver = DispatcherResolver;
        DispatcherResolver = _aureliaDependencyInjection.resolver(DispatcherResolver) || DispatcherResolver;
        return DispatcherResolver;
    })();

    exports.DispatcherResolver = DispatcherResolver;

    function handlerCreationCb(handler) {
        var index = handler.dependencies.indexOf(_instanceDispatcher.Dispatcher);

        if (index !== -1) {
            (function () {
                handler.dependencies[index] = new DispatcherResolver();

                var invoke = handler.invoke;
                handler.invoke = function (container, dynamicDependencies) {

                    var instance = invoke.call(handler, container, dynamicDependencies);

                    container._lastDispatcher.connect(instance);
                    container._lastDispatcher = null;

                    return instance;
                };
            })();
        }

        return handler;
    }
});