import {Metadata} from './metadata';
import {Utils} from './utils';
import {FluxDispatcher} from './flux-dispatcher';
import Promise from 'bluebird';
import {Symbols} from './symbols';
import {LifecycleManager} from './lifecycle-manager';

class Handler {
    constructor(regexp, handler) {
        this.regexp = regexp;
        this.function = handler;
    }
}

export class Dispatcher {

    constructor() {
        this.handlers = new Set();
    }

    /**
     * Connects the instance related to this Dispatcher.
     * If there is existing metadata for the instance (i.e. if the
     * class has methods decorated with @handle or @waitFor
     * we need to associate the instance with the dispatcher (which
     * has been created already)
     * If no metadata is associated, this Dispatcher instance will
     * not be associated to anything and garbage-collected
     *
     * @method connect
     * @param {instance:Object} instance to connect
     */
    connect(instance: Object) {
        if(Metadata.exists(Object.getPrototypeOf(instance))) {

            // associates the instance with the dispatcher
            this.instance = instance;
            instance[Symbols.instanceDispatcher] = this;
            LifecycleManager.interceptInstanceDeactivators(instance);

            // registers the dispatcher
            this.registerMetadata();
            FluxDispatcher.instance.registerInstanceDispatcher(this);
        }
    }

    /**
     * Registers new handler function for given action patterns
     *
     * @method handle
     * @param {String|String[]} patterns
     * @param {(action:String, ...payload : any[]) => any} callback
     * @return {() => void} - unregistering function
     */
    handle(patterns : String|String[], callback : ((action : String, ...payload : any[]) => any)) : (() => void)  {
        var handler = new Handler(Utils.patternsToRegex(patterns), callback)
        this.handlers.add(handler);

        return () => {
            this.handlers.delete(handler);
        };
    }

    /**
     * Registers a method that will be invoked when all
     * given types finish dispatching
     * 
     * @method waitFor
     * @param {String|String[]} types
     * @param {(() => any)} handler
     * @return void
     */
    waitFor(types : String|String[], handler : (() => any)) : void {                                            
        FluxDispatcher.instance.waitFor(types, handler);
    }

    /**
     * Dispatches an action alond with all passed
     * parameters (paylod)
     * 
     * @method dispatch
     * @param {String} action
     * @param {any[]} ...payload
     * @return void 
     */
    dispatch(action : String, ...payload:any[]) : void {
        FluxDispatcher.instance.dispatch(action, payload);
    }

    dispatchOwn(action : String, payload:any[]) {

        var promises = [];

        this.handlers.forEach((handler) => {
            if(handler.regexp.test(action)) {
                promises.push(Promise.resolve(handler.function.apply(this.instance, [action].concat(payload))));
            }
        });

        return Promise.settle(promises);
    }

    registerMetadata() : void {
        var metadata = Metadata.getOrCreateMetadata(Object.getPrototypeOf(this.instance));

        metadata.awaiters.forEach((types, methodName) => {
            if(this.instance[methodName] !== undefined && typeof this.instance[methodName] === 'function') {
                var methodImpl = this.instance[methodName];
                this.instance[methodName] = (...args) => {
                    return FluxDispatcher.instance.waitFor(types, () => {
                        methodImpl.apply(this.instance, args);
                    });
                };
            }
        });

        metadata.handlers.forEach((patterns, methodName) => {
            if(this.instance[methodName] !== undefined && typeof this.instance[methodName] === 'function') {
                this.handlers.add(new Handler(Utils.patternsToRegex(patterns), this.instance[methodName]));
            }
        });
    }
}
