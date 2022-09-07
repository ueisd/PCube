'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { DeleteTimelinesRequest } from './DeleteTimelinesRequest';

export class DeleteTimelinesInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway) {
    this.timelineDb = timelineDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    const { timelineIds } = request as DeleteTimelinesRequest;

    return this.tryDeleteTimelinesWithIds(timelineIds);
  }

  private async tryDeleteTimelinesWithIds(timelineIds) {
    const res = await this.timelineDb.deleteTimelinesWithIds(timelineIds);

    if (!res || res < 1) {
      throw new Error("Les timelines n'ont pas pu toutes être supprimées dans la BD");
    }

    return timelineIds;
  }
}
