'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { CheckExpenseAccountNameExistRequest } from './CheckExpenseAccountNameExistRequest';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class CheckExpenseAccountIsDeletableInterractor implements UseCaseActivator {
  constructor() {}

  public async execute(request?: UseCaseRequest): Promise<Boolean> {
    // @todo mettre en place les contraintes : pas supprimer quand des lignes de temps existent
    return true;
  }
}
