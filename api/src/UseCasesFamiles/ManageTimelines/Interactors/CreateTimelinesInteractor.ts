'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import TimelineDatabaseGateway from '../../../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { CreateTimelinesRequest } from './CreateTimelinesRequest';

export class CreateTimelinesInteractor implements UseCaseActivator {
  private timelineDb: TimelineDatabaseGateway;

  constructor(timelineDb: TimelineDatabaseGateway) {
    this.timelineDb = timelineDb;
  }

  public async execute(request: UseCaseRequest): Promise<any> {
    const { timelines } = request as CreateTimelinesRequest;

    return this.tryCreateTimelines(timelines);
  }

  private async tryCreateTimelines(timelines) {
    const res = await this.timelineDb.createTimelines(timelines);
    if (!res) {
      // TODO gérer l'erreure dans le frontend (PLM)
      throw new Error("Problème, impossible d'enregistrer de nouvelles lignes dans la BD");
    }

    return res;
  }
}
