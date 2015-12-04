declare module 'aurelia-flux' {
  import { FluxDispatcher }  from 'aurelia-flux/flux-dispatcher';
  import { Metadata }  from 'aurelia-flux/metadata';
  import { Symbols }  from 'aurelia-flux/symbols';
  import Promise from 'bluebird';
  import { activationStrategy }  from 'aurelia-router';
  export class LifecycleManager {
    static interceptInstanceDeactivators(instance: any): any;
    static interceptInstanceDeactivate(instance: any): any;
    static interceptInstanceDetached(instance: any): any;
  }
}