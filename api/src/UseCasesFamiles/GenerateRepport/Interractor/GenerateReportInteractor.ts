'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { GenerateReportRequest } from './GenerateReportRequest';
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';
import ReportLine from '../../../models/report-line.model';
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

    lines = lines.map((item) => ReportLine.fetchFromTimelineEagerResponse(item));

    let expenses = await this.expenseAccountDb.listAll();
    expenses = expenses.map((item) => ReportLine.fetchFromExpenseAccountResponse(item));

    for (let item of lines as any) {
      const lRes = expenses.find((l) => item.id === l.id) as any;
      if (lRes) {
        lRes.summline += item.summline;
      }
    }

    return expenses;
  }
}
