import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class GenerateReportController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.SEND,
      url: opts.url,
      useCaseName: 'GenerateReport',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
