'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import { CheckExpenseAccountNameExistRequest } from './CheckExpenseAccountNameExistRequest';
import ExpenseAccountDatabaseGateway from '../../../EntitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class CheckExpenseAccountIsDeletableInterractor implements UseCaseActivator {
  constructor() {}

  public async execute(request?: UseCaseRequest): Promise<Boolean> {
    // @todo mettre en place les contraintes : pas supprimer quand des lignes de temps existent
    return true;
  }
}
