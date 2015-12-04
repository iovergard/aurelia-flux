declare module 'aurelia-flux' {
  
  //  plugin configuration
  import { handlerCreationCb }  from 'aurelia-flux/dependency-injection';
  import { patchHtmlBehaviorResource }  from 'aurelia-flux/templating';
  import { RouterManager }  from 'aurelia-flux/router';
  
  //  Exposed objects
  export { Dispatcher } from 'aurelia-flux/instance-dispatcher';
  export { handle } from 'aurelia-flux/decorators/handle';
  export { waitFor } from 'aurelia-flux/decorators/waitFor';
  export function configure(aurelia: any, configCallback: any): any;
}