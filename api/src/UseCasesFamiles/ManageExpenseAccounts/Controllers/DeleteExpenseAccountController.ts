import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class DeleteExpenseAccountController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.DELETE,
      url: opts.url,
      useCaseName: 'DeleteExpenseAccount',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
