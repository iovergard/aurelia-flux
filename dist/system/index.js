System.register(['./dependency-injection', './templating', './router', './instance-dispatcher', './decorators/handle', './decorators/waitFor'], function (_export) {
    'use strict';

    var handlerCreationCb, patchHtmlBehaviorResource, RouterManager;

    _export('configure', configure);

    function configure(aurelia, configCallback) {

        aurelia.container.setHandlerCreatedCallback(handlerCreationCb);
        patchHtmlBehaviorResource();
        RouterManager.AddFluxPipelineStep(aurelia);
    }

    return {
        setters: [function (_dependencyInjection) {
            handlerCreationCb = _dependencyInjection.handlerCreationCb;
        }, function (_templating) {
            patchHtmlBehaviorResource = _templating.patchHtmlBehaviorResource;
        }, function (_router) {
            RouterManager = _router.RouterManager;
        }, function (_instanceDispatcher) {
            _export('Dispatcher', _instanceDispatcher.Dispatcher);
        }, function (_decoratorsHandle) {
            _export('handle', _decoratorsHandle.handle);
        }, function (_decoratorsWaitFor) {
            _export('waitFor', _decoratorsWaitFor.waitFor);
        }],
        execute: function () {}
    };
});