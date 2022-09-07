'use strict';

import Timeline from '../Entities/Timeline';

export default interface TimelineDatabaseGateway {
  createTimeline(props): Promise<Timeline>;
  getTimelineById(timelineId): Promise<Timeline>;
  getAllFromReqParams(params): Promise<Timeline[]>;
  getReportFromReqParams(params): Promise<Timeline[]>;
  createTimelines(timelines): Promise<Timeline>;
  updateTimeline(id: number, props: any): Promise<Timeline>;
  deleteTimelinesWithIds(timelineIds: number[]);
}
