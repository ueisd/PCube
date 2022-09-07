import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../delivery/guards/isLoggedIn.guard';

export class UpdateTimelinesController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.UPDATE,
      url: opts.url,
      useCaseName: 'UpdateTimelines',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
