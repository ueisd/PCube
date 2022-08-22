"use strict";

import Project from "../entities/Project";

export default interface ProjectDatabaseGateway {
  createProject(props: { name: string }): Promise<Project>;
  findProjectById(projectId: number): Promise<Project>;
  addSubProjectsToProject(project, subProjects): Promise<void>;
}
