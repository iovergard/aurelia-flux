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
        return container._lastDispatcher = new Dispatcher();
    }

}

export function handlerCreationCb(handler) {
    let index = handler.dependencies.indexOf(Dispatcher);

    if(index !== -1) {
        handler.dependencies[index] = new DispatcherResolver();

        let invoke = handler.invoke;
        handler.invoke = function(container, dynamicDependencies) {

            let instance = invoke.call(handler, container, dynamicDependencies);

            container._lastDispatcher.connect(instance);
            container._lastDispatcher = null;

            return instance;
        };
    }

    return handler;
}
