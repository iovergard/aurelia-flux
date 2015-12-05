declare module 'aurelia-flux' {
  import { resolver }  from 'aurelia-dependency-injection';
  import { Dispatcher }  from 'aurelia-flux/instance-dispatcher';
  import { Metadata }  from 'aurelia-flux/metadata';
  import { Symbols }  from 'aurelia-flux/symbols';
  export class DispatcherResolver {
    get(container: any): any;
  }
  export function handlerCreationCb(handler: any): any;
}