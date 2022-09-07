'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../EntitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { GenerateReportRequest } from '../../GenerateRepport/Interractor/GenerateReportRequest';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class GetLinesInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway) {
    this.timelineDb = timelineDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    return this.timelineDb.getAllFromReqParams(request as GenerateReportRequest);
  }
}
