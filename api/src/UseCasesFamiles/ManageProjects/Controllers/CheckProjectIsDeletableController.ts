import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class CheckProjectIsDeletableController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      useCaseName: 'CheckProjectIsDeletable',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
