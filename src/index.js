// Exposed objects
export {Dispatcher} from './instance-dispatcher';
export {handle} from './decorators/handle';
export {waitFor} from './decorators/waitFor';


// plugin configuration
import {handlerCreationCb} from './dependency-injection';
import {patchHtmlBehaviorResource} from './templating';
import {RouterManager} from './router';

export function configure(aurelia, configCallback) {

    aurelia.container.setHandlerCreatedCallback(handlerCreationCb);
    patchHtmlBehaviorResource();
    RouterManager.AddFluxPipelineStep(aurelia);

}
