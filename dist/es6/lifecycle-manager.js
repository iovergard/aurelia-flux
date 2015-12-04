import {FluxDispatcher} from './flux-dispatcher';
import {Metadata} from './metadata';
import {Symbols} from './symbols';
import Promise from 'bluebird';
import {activationStrategy} from 'aurelia-router';


export class LifecycleManager {

    static interceptInstanceDeactivators(instance) {
        if(instance[Symbols.deactivators] === true) {
          return;
        }

        LifecycleManager.interceptInstanceDeactivate(instance);
        LifecycleManager.interceptInstanceDetached(instance);

        instance[Symbols.deactivators] = true;
    }

    static interceptInstanceDeactivate(instance) {

      function _unregister() {
        if(FluxDispatcher.instance.strategy !== activationStrategy.invokeLifecycle) {
          FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
        }
      }

      if(instance.deactivate !== undefined) {
          var deactivateImpl = instance.deactivate;
          instance.deactivate = function(...args) {
              _unregister();              
              deactivateImpl.apply(instance, args);
          };
      } else {
          instance.deactivate = function() {
              _unregister();
          };
      }
    }

    static interceptInstanceDetached(instance) {
      if(instance.detached !== undefined) {
          var deactivateImpl = instance.detached;
          instance.detached = function(...args) {
              FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
              deactivateImpl.apply(instance, args);
          };
      } else {
          instance.detached = function() {
              FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
          };
      }
    }

}
