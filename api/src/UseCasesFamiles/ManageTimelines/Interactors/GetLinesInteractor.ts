'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { GenerateReportRequest } from '../../GenerateRepport/Interractor/GenerateReportRequest';
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class GetLinesInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway) {
    this.timelineDb = timelineDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    return this.timelineDb.getAllFromReqParams(request as GenerateReportRequest);
  }
}
