import {HtmlBehaviorResource} from 'aurelia-templating';

import {patchHtmlBehaviorResource} from '../src/templating';
import {Symbols} from '../src/symbols';


describe('templating', () => {

    describe('patchHtmlBehaviorResource', () => {

        describe('intercepted initialize method', () => {

            it('runs original method', () => {
                var initialize = jasmine.createSpy('initialize');
                HtmlBehaviorResource.prototype.initialize = initialize;
                patchHtmlBehaviorResource();
                expect(HtmlBehaviorResource.prototype.initialize).not.toBe(initialize);

                function target() {
                };

                HtmlBehaviorResource.prototype.initialize(1, target, false);
                expect(initialize).toHaveBeenCalledWith(1, target, false);
            });

            it('adds detached method to a target with flux metadata', () => {
                function target() {
                }

                target.prototype[Symbols.metadata] = {
                    handlers: {
                        size: 123
                    }
                };

                expect(target.prototype.detached).toBeUndefined();
                HtmlBehaviorResource.prototype.initialize = function () {
                };
                patchHtmlBehaviorResource();
                HtmlBehaviorResource.prototype.initialize(null, target);
                expect(target.prototype.detached).toBeDefined();
            });

            it('doesn\'t add detached method to a target without flux metadata', () => {
                function target() {
                }

                expect(target.prototype.detached).toBeUndefined();
                HtmlBehaviorResource.prototype.initialize = function () {
                };
                patchHtmlBehaviorResource();
                HtmlBehaviorResource.prototype.initialize(null, target);
                expect(target.prototype.detached).toBeUndefined();
            });

        });
    });
});
