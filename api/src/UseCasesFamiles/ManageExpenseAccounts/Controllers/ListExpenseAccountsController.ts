import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../delivery/guards/isLoggedIn.guard';

export class ListExpenseAccountsController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      useCaseName: 'ListExpenseAccounts',
      beforeCommandMiddlewares: [isLoggedIn],
      ...opts,
    });
  }
}
