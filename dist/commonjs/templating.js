'use strict';

exports.__esModule = true;
exports.patchHtmlBehaviorResource = patchHtmlBehaviorResource;

var _aureliaTemplating = require('aurelia-templating');

var _symbols = require('./symbols');

function patchHtmlBehaviorResource() {

    if (_aureliaTemplating.HtmlBehaviorResource === undefined || typeof _aureliaTemplating.HtmlBehaviorResource.prototype.initialize !== 'function') {
        throw new Error('Unsupported version of HtmlBehaviorResource');
    }

    var initializeImpl = _aureliaTemplating.HtmlBehaviorResource.prototype.initialize;

    _aureliaTemplating.HtmlBehaviorResource.prototype.initialize = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var target = args[1];
        if (target && target.prototype && target.prototype[_symbols.Symbols.metadata] && target.prototype[_symbols.Symbols.metadata].handlers && target.prototype[_symbols.Symbols.metadata].handlers.size) {
            if (target.prototype.detached === undefined) {
                target.prototype.detached = function () {};
            }
        }
        return initializeImpl.apply(this, args);
    };
}