"use strict";

import Timeline from "../Entities/Timeline";

export default interface TimelineDatabaseGateway {
  createTimeline(props): Promise<Timeline>;
  getTimelineById(timelineId): Promise<Timeline>;
  getAllFromReqParams(params): Promise<Timeline[]>;
  getReportFromReqRarams(params): Promise<Timeline[]>;
}
