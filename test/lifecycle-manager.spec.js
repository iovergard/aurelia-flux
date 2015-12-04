import {LifecycleManager} from '../src/lifecycle-manager';
import {FluxDispatcher} from '../src/flux-dispatcher';
import {Symbols} from '../src/symbols';
import {Dispatcher} from '../src/instance-dispatcher';
import {Metadata} from '../src/metadata';


describe('Lifecycle Manager', () => {
    describe('interceptInstanceDeactivate', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        describe('without instance.deactivate', () => {
            it('adds new deactivate method', () => {
                expect(instance.deactivate).toBeUndefined();
                LifecycleManager.interceptInstanceDeactivate(instance);
                expect(instance.deactivate).toBeDefined();
            });

            describe('intercepted deactivate method', () => {
                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });

        describe('with instance.deactivate', () => {
            it('intercepts deactivate method', () => {
                var deactivate = function () { };
                instance.deactivate = deactivate;
                LifecycleManager.interceptInstanceDeactivate(instance);
                expect(instance.deactivate).toBeDefined();
                expect(instance.deactivate).not.toBe(deactivate);
            });

            describe('intercepted deactivate method', () => {
                it('runs original deactivate method', () => {
                    var deactivate = jasmine.createSpy('deactivate');
                    instance.deactivate = deactivate;
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(deactivate).toHaveBeenCalled();
                });

                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    var deactivate = function () { };
                    instance.deactivate = deactivate;
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });
    });


    describe('interceptInstanceDetached', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        describe('without instance.detached', () => {
            it('adds new detached method', () => {
                expect(instance.detached).toBeUndefined();
                LifecycleManager.interceptInstanceDetached(instance);
                expect(instance.detached).toBeDefined();
            });

            describe('intercepted detached method', () => {
                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });

        describe('with instance.detached', () => {
            it('intercepts detached method', () => {
                var detached = function () { };
                instance.detached = detached;
                LifecycleManager.interceptInstanceDetached(instance);
                expect(instance.detached).toBeDefined();
                expect(instance.detached).not.toBe(detached);
            });

            describe('intercepted detached method', () => {
                it('runs original detached method', () => {
                    var detached = jasmine.createSpy('detached');
                    instance.detached = detached;
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(detached).toHaveBeenCalled();
                });

                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    var detached = function () { };
                    instance.detached = detached;
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });
    });


    describe('interceptInstanceDeactivators', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        it('sets Symbols.deactivators on an instance when invoked', () => {
            expect(instance[Symbols.deactivators]).toBeUndefined();
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(instance[Symbols.deactivators]).toBeDefined();
        });

        it('runs LifecycleManager.interceptInstanceDeactivate', () => {
            spyOn(LifecycleManager, 'interceptInstanceDeactivate');
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDeactivate).toHaveBeenCalledWith(instance);
        });

        it('runs LifecycleManager.interceptInstanceDeactivate only once', () => {
            spyOn(LifecycleManager, 'interceptInstanceDeactivate');
            LifecycleManager.interceptInstanceDeactivators(instance);
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDeactivate.calls.count()).toEqual(1);
        });

        it('runs LifecycleManager.interceptInstanceDetached', () => {
            spyOn(LifecycleManager, 'interceptInstanceDetached');
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDetached).toHaveBeenCalledWith(instance);
        });

        it('runs LifecycleManager.interceptInstanceDetached only once', () => {
            spyOn(LifecycleManager, 'interceptInstanceDetached');
            LifecycleManager.interceptInstanceDeactivators(instance);
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDetached.calls.count()).toEqual(1);
        });
    });

});
