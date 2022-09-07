import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class UpdateActivityController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.UPDATE,
      url: opts.url,
      useCaseName: 'UpdateActivity',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
