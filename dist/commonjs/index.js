'use strict';

exports.__esModule = true;
exports.configure = configure;

var _dependencyInjection = require('./dependency-injection');

var _templating = require('./templating');

var _router = require('./router');

var _instanceDispatcher = require('./instance-dispatcher');

exports.Dispatcher = _instanceDispatcher.Dispatcher;

var _decoratorsHandle = require('./decorators/handle');

exports.handle = _decoratorsHandle.handle;

var _decoratorsWaitFor = require('./decorators/waitFor');

exports.waitFor = _decoratorsWaitFor.waitFor;

function configure(aurelia, configCallback) {

    aurelia.container.setHandlerCreatedCallback(_dependencyInjection.handlerCreationCb);
    _templating.patchHtmlBehaviorResource();
    _router.RouterManager.AddFluxPipelineStep(aurelia);
}