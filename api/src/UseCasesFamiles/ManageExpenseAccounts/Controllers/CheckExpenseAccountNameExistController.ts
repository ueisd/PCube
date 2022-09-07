import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class CheckExpenseAccountNameExistController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      useCaseName: 'CheckExpenseAccountNameExist',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
