import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../guards/isLoggedIn.guard';

export class GetLinesController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.SEND,
      url: opts.url,
      useCaseName: 'GetLines',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
