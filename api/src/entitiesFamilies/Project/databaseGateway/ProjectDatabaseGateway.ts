'use strict';

import Project from '../entities/Project';

export default interface ProjectDatabaseGateway {
  createProject(props: { name: string; ProjectId?: number }): Promise<Project>;
  findProjectById(projectId: number): Promise<Project>;
  addSubProjectsToProject(project, subProjects): Promise<void>;
  listAll(): Promise<Project[]>;
  isProjectNameExist(name: string): Promise<boolean>;
  updateProject(id: number, props: any): Promise<Project>;
}
