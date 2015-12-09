import {resolver} from 'aurelia-dependency-injection';

import {Dispatcher} from './instance-dispatcher';
import {Metadata} from './metadata';
import {Symbols} from './symbols';


@resolver
export class DispatcherResolver {

    get(container) {
        // returns a new Dispatcher each time, as each instance has its own
        // Dispatcher instance. If it is not used (= not associated to an
        // instance) it will be garbage-collected
        var newDispatcher = new Dispatcher();
        try {
            container._dispatchers.push(newDispatcher);
        } catch (e) {
            container._dispatchers = [newDispatcher];
        }
        return newDispatcher;
    }

}

export function handlerCreationCb(handler) {
    let index = handler.dependencies.indexOf(Dispatcher),
        invoke = handler.invoke;

    if(index === -1) {
        // if Dispatcher is not injected, we need to monkey-patch invoke
        // to check if some Metadata for the instance exists (i.e. if some
        // methods have been decorated by @handle or @waitFor)

        // TODO: replace this by automatic registration when a decorator
        // is used on a method, instead of monkey-patching invoke for every
        // class

        handler.invoke = function(container, dynamicDependencies) {
            let instance = invoke.call(this, container, dynamicDependencies);

            // no DispatcherResolver has been called, so we need to manually
            // create the Dispatcher if the instance has metadata attached

            if (Metadata.exists(Object.getPrototypeOf(instance))) {
                (new Dispatcher()).connect(instance);
            }

            return instance;
        };

    } else {
        // if a Dispatcher is injected, we turn the handler dependency into
        // a DispatcherResolver and monkey-patch the invoke method so that
        // the new Dispatcher instance created by DispatcherResolved is
        // associated with the instance

        handler.dependencies[index] = new DispatcherResolver();

        handler.invoke = function(container, dynamicDependencies) {

            let instance = invoke.call(this, container, dynamicDependencies);

            var dispatcher = container._dispatchers.pop();
            if (Metadata.exists(Object.getPrototypeOf(instance))) {
                dispatcher.connect(instance);
            }

            return instance;
        };
    }

    return handler;
}
