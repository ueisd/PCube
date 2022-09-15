import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../delivery/guards/isLoggedIn.guard';

export class DeleteTimelinesController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.DELETE,
      url: opts.url,
      useCaseName: 'DeleteTimelines',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}