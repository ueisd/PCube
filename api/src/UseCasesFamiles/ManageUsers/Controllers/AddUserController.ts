import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class AddUserController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.CREATE,
      url: opts.url,
      useCaseName: 'AddUser',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
