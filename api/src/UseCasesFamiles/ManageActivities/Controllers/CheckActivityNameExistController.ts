import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../delivery/guards/isLoggedIn.guard';

export class CheckActivityNameExistController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.SEND,
      url: opts.url,
      useCaseName: 'CheckActivityNameExist',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
