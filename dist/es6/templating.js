import {HtmlBehaviorResource} from 'aurelia-templating';

import {Symbols} from './symbols';


export function patchHtmlBehaviorResource() {

    if(HtmlBehaviorResource === undefined
            || typeof HtmlBehaviorResource.prototype.initialize !== 'function') {
        throw new Error('Unsupported version of HtmlBehaviorResource');
    }

    var initializeImpl = HtmlBehaviorResource.prototype.initialize;

    HtmlBehaviorResource.prototype.initialize = function(...args) {
    let target = args[1];
    if(target && target.prototype
              && target.prototype[Symbols.metadata]
              && target.prototype[Symbols.metadata].handlers
              && target.prototype[Symbols.metadata].handlers.size) {
        if(target.prototype.detached === undefined) {
            target.prototype.detached = function() {};
        }
    }
    return initializeImpl.apply(this, args);
};
}
