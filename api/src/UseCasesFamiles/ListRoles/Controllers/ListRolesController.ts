import { Controller } from '../../_utils/Controller';
import { isLoggedIn } from '../../../guards/isLoggedIn.guard';

export class ListRolesController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      useCaseName: 'ListRoles',
      beforeCommandMiddlewares: [isLoggedIn],
    });
  }
}
