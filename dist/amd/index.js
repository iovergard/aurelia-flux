define(['exports', './dependency-injection', './templating', './router', './instance-dispatcher', './decorators/handle', './decorators/waitFor'], function (exports, _dependencyInjection, _templating, _router, _instanceDispatcher, _decoratorsHandle, _decoratorsWaitFor) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;
    exports.Dispatcher = _instanceDispatcher.Dispatcher;
    exports.handle = _decoratorsHandle.handle;
    exports.waitFor = _decoratorsWaitFor.waitFor;

    function configure(aurelia, configCallback) {

        aurelia.container.setHandlerCreatedCallback(_dependencyInjection.handlerCreationCb);
        _templating.patchHtmlBehaviorResource();
        _router.RouterManager.AddFluxPipelineStep(aurelia);
    }
});