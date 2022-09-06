'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class CheckProjectsDeletableInterractor implements UseCaseActivator {
  constructor() {}

  public async execute(request?: UseCaseRequest): Promise<Boolean> {
    // @todo mettre en place les contraintes : pas supprimer quand des lignes de temps existent
    return true;
  }
}
