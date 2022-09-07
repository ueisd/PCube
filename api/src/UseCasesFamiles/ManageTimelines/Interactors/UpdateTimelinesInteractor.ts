'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { UpdateTimelinesRequest } from './UpdateTimelinesRequest';

export class UpdateTimelinesInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway) {
    this.timelineDb = timelineDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    const { timelines } = request as UpdateTimelinesRequest;

    // TODO mette erreur management (PLM)

    for (let timeline of timelines) {
      const { id, ...props } = timeline;
      await this.timelineDb.updateTimeline(id, props);
    }

    return timelines;
  }
}
