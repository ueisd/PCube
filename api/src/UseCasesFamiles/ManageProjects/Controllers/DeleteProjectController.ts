import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../system/guards/isLoggedIn.guard';

export class DeleteProjectController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.DELETE,
      url: opts.url,
      useCaseName: 'DeleteProject',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
