'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { GenerateReportRequest } from './GenerateReportRequest';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class GenerateReportInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway, expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.timelineDb = timelineDb;
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    let lines = await this.timelineDb.getReportFromReqParams(request as GenerateReportRequest);

    lines = lines.map((item) => this.fetchFromTimelineEagerResponse(item));

    let expenses = await this.expenseAccountDb.listAll();
    expenses = expenses.map((item) => this.fetchFromExpenseAccountResponse(item));

    for (let item of lines as any) {
      const lRes = expenses.find((l) => item.id === l.id) as any;
      if (lRes) {
        lRes.summline += item.summline;
      }
    }

    return expenses;
  }

  private fetchFromExpenseAccountResponse(item) {
    let line: any = {};
    line.id = item.id;
    line.name = item.name;
    line.parent_id = item.ExpenseAccountId;
    line.summline = 0;
    line.sumTotal = 0;
    line.child = [];
    return line;
  }

  private fetchFromTimelineEagerResponse(item) {
    let line: any = {};
    line.id = item['ExpenseAccount.id'];
    line.name = item['ExpenseAccount.nom'];
    line.parent_id = item['ExpenseAccount.parentId'];
    if (item.seconds) {
      let secs: number = parseInt(item.seconds);
      let rems: number = secs % 60;
      line.summline = parseInt(String((secs - rems) / 60));
    } else line.summline = 0;
    line.sumTotal = 0;
    line.child = [];
    return line;
  }
}
