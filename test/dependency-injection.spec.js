import {Container} from 'aurelia-dependency-injection';

import {handlerCreationCb} from '../src/dependency-injection';
import {Dispatcher} from '../src/instance-dispatcher';
import {DispatcherResolver} from '../src/dependency-injection';
import {Symbols} from '../src/symbols';
import {LifecycleManager} from '../src/lifecycle-manager';
import {Metadata} from '../src/metadata';
import {FluxDispatcher} from '../src/flux-dispatcher';


describe('dependency injection', () => {

    describe('handlerCreationCb', () => {

        var instance,
            instanceProto,
            container,
            handler;

        class Handler {
            constructor () {
                this.dependencies = [];
            }
            invokeImpl(fn, dynamicDependencies) {
                var deps = (dynamicDependencies === undefined ?
                            this.dependencies : dynamicDependencies);

                for (let i = 0; i < deps.length; i++) {
                    // simulates actual invoke() operation
                    container.get(deps[i]);
                }

                return instance;
            }
        }

        class Container {
            get(key) {
                return key.get(this);
            }
        }

        beforeEach(() => {
            instanceProto = {};
            instance = Object.create(instanceProto);
            container = new Container();

            handler = new Handler();
            spyOn(Handler.prototype, 'invokeImpl').and.callThrough();
            handler.invoke = handler.invokeImpl;
        });

        it('intercepts handler.invoke', () => {
            handlerCreationCb(handler);
            expect(handler.invoke).not.toBe(handler.invokeImpl);
        });

        describe('without dispatcher injected', () => {

            it('runs original invoke method', () => {
                handlerCreationCb(handler);
                handler.invoke(container, []);
                expect(handler.invokeImpl).toHaveBeenCalled();
            });

            it('returns proper instance', () => {
                handlerCreationCb(handler);
                var result = handler.invoke(container, []);
                expect(result).toBe(instance);
            });

            describe('for instance prototype with metadata', () => {

                beforeEach(() => {
                    instanceProto[Symbols.metadata] = new Metadata();
                });

                it('sets instance[Symbols.instanceDispatcher]', () => {
                    handlerCreationCb(handler);
                    expect(instance[Symbols.instanceDispatcher]).toBeUndefined();
                    handler.invoke(container);
                    expect(instance[Symbols.instanceDispatcher]).toBeDefined();
                });

                it('runs instance Disptacher.registerMetadata', () => {
                    spyOn(Dispatcher.prototype, 'registerMetadata');
                    handlerCreationCb(handler);
                    handler.invoke(container, []);
                    expect(Dispatcher.prototype.registerMetadata).toHaveBeenCalled();
                });

                it('intercepts instance deactivators', () => {
                    spyOn(LifecycleManager, 'interceptInstanceDeactivators');
                    handlerCreationCb(handler);
                    handler.invoke(container, []);
                    expect(LifecycleManager.interceptInstanceDeactivators).toHaveBeenCalledWith(instance);
                });
            });

        });

        describe('with dispatcher injected', () => {


            beforeEach(() => {
                handler.dependencies.push(Dispatcher);
            });

            it('runs original invoke method', () => {
                handlerCreationCb(handler);
                handler.invoke(container);
                expect(handler.invokeImpl).toHaveBeenCalled();
            });

            it('returns proper instance', () => {
                handlerCreationCb(handler);
                var result = handler.invoke(container);
                expect(result).toBe(instance);
            });

            it('replaces injected Dispatcher with DispatcherResolver', () => {
                handlerCreationCb(handler);
                expect(handler.dependencies[0] instanceof DispatcherResolver).toBe(true);
            });

            it('does not set instance[Symbols.instanceDispatcher] without metadata', () => {
                handlerCreationCb(handler);
                expect(instance[Symbols.instanceDispatcher]).toBeUndefined();
                handler.invoke(container);
                expect(instance[Symbols.instanceDispatcher]).toBeUndefined();
            });

            it('does not intercepts instance deactivators without metadata', () => {
                spyOn(LifecycleManager, 'interceptInstanceDeactivators');
                handlerCreationCb(handler);
                handler.invoke(container);
                expect(LifecycleManager.interceptInstanceDeactivators.calls.any()).toBe(false);
            });


            describe('for instance prototype with metadata', () => {

                beforeEach(() => {
                    instanceProto[Symbols.metadata] = new Metadata();
                });

                it('sets instance[Symbols.instanceDispatcher]', () => {
                    handlerCreationCb(handler);
                    expect(instance[Symbols.instanceDispatcher]).toBeUndefined();
                    handler.invoke(container);
                    expect(instance[Symbols.instanceDispatcher]).toBeDefined();
                });

                it('runs instance Disptacher.registerMetadata', () => {
                    spyOn(Dispatcher.prototype, 'registerMetadata');
                    handlerCreationCb(handler);
                    handler.invoke(container);
                    expect(Dispatcher.prototype.registerMetadata).toHaveBeenCalled();
                });

                it('intercepts instance deactivators', () => {
                    spyOn(LifecycleManager, 'interceptInstanceDeactivators');
                    handlerCreationCb(handler);
                    handler.invoke(container);
                    expect(LifecycleManager.interceptInstanceDeactivators).toHaveBeenCalledWith(instance);
                });
            });
        });

    });

});
