export {Dispatcher} from './instance-dispatcher';

/*
 * Decorators
 */
export {handle} from './decorators/handle';
export {waitFor} from './decorators/waitFor';

import {LifecycleManager} from './lifecycle-manager';
import {RouterManager} from './router';

export function configure(aurelia, configCallback) {
    LifecycleManager.interceptFactoryInvoker();
    LifecycleManager.interceptHtmlBehaviorResource();
    RouterManager.AddFluxPipelineStep(aurelia);
}
