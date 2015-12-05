System.register(['aurelia-templating', './symbols'], function (_export) {
    'use strict';

    var HtmlBehaviorResource, Symbols;

    _export('patchHtmlBehaviorResource', patchHtmlBehaviorResource);

    function patchHtmlBehaviorResource() {

        if (HtmlBehaviorResource === undefined || typeof HtmlBehaviorResource.prototype.initialize !== 'function') {
            throw new Error('Unsupported version of HtmlBehaviorResource');
        }

        var initializeImpl = HtmlBehaviorResource.prototype.initialize;

        HtmlBehaviorResource.prototype.initialize = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var target = args[1];
            if (target && target.prototype && target.prototype[Symbols.metadata] && target.prototype[Symbols.metadata].handlers && target.prototype[Symbols.metadata].handlers.size) {
                if (target.prototype.detached === undefined) {
                    target.prototype.detached = function () {};
                }
            }
            return initializeImpl.apply(this, args);
        };
    }

    return {
        setters: [function (_aureliaTemplating) {
            HtmlBehaviorResource = _aureliaTemplating.HtmlBehaviorResource;
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }],
        execute: function () {}
    };
});