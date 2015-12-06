System.register(['aurelia-dependency-injection', './instance-dispatcher', './metadata', './symbols'], function (_export) {
    'use strict';

    var resolver, Dispatcher, Metadata, Symbols, DispatcherResolver;

    _export('handlerCreationCb', handlerCreationCb);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function handlerCreationCb(handler) {
        var index = handler.dependencies.indexOf(Dispatcher),
            invoke = handler.invoke;

        if (index === -1) {

            handler.invoke = function (container, dynamicDependencies) {
                var instance = invoke.call(this, container, dynamicDependencies);

                if (Metadata.exists(Object.getPrototypeOf(instance))) {
                    new Dispatcher().connect(instance);
                }

                return instance;
            };
        } else {

            handler.dependencies[index] = new DispatcherResolver();

            handler.invoke = function (container, dynamicDependencies) {

                var instance = invoke.call(this, container, dynamicDependencies);

                if (Metadata.exists(Object.getPrototypeOf(instance))) {
                    container._lastDispatcher.connect(instance);
                }
                container._lastDispatcher = null;

                return instance;
            };
        }

        return handler;
    }

    return {
        setters: [function (_aureliaDependencyInjection) {
            resolver = _aureliaDependencyInjection.resolver;
        }, function (_instanceDispatcher) {
            Dispatcher = _instanceDispatcher.Dispatcher;
        }, function (_metadata) {
            Metadata = _metadata.Metadata;
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }],
        execute: function () {
            DispatcherResolver = (function () {
                function DispatcherResolver() {
                    _classCallCheck(this, _DispatcherResolver);
                }

                DispatcherResolver.prototype.get = function get(container) {
                    return container._lastDispatcher = new Dispatcher();
                };

                var _DispatcherResolver = DispatcherResolver;
                DispatcherResolver = resolver(DispatcherResolver) || DispatcherResolver;
                return DispatcherResolver;
            })();

            _export('DispatcherResolver', DispatcherResolver);
        }
    };
});