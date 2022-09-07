import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../delivery/guards/isLoggedIn.guard';

export class CreateExpenseAccountController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.CREATE,
      url: opts.url,
      useCaseName: 'CreateExpenseAccount',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
