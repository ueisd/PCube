'use strict';

import ProjectImpl from './ProjectImpl';
import Project from '../entities/Project';
import _ = require('lodash');
import ProjectDatabaseGateway from '../databaseGateway/ProjectDatabaseGateway';
import ActivityImpl from '../../Activity/gatabaseImpls/ActivityImpl';
import Activity from '../../Activity/entities/Activity';

export default class ProjectDataBaseGatewayImpl implements ProjectDatabaseGateway {
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    ProjectImpl.initModel(sequelize);

    ProjectImpl.belongsTo(ProjectImpl, { targetKey: 'id' });
    ProjectImpl.hasMany(ProjectImpl);
  }

  public async updateProject(id: number, props: any): Promise<Project> {
    return ProjectImpl.update(props, { where: { id } });
  }

  public async isProjectNameExist(name: string): Promise<boolean> {
    const res = await ProjectImpl.findAll({
      where: { name },
      raw: true,
    });

    return !(!res || !res[0]);
  }

  public async listAll(): Promise<Project[]> {
    return ProjectImpl.findAll({
      order: [['id', 'DESC']],
      raw: true,
    });
  }

  public async createProject(props: { name: string; ProjectId?: number }): Promise<Project> {
    const projectModel: any = {
      name: props.name,
      ProjectId: props.ProjectId,
    };

    return ProjectImpl.create(projectModel);
  }

  public async findProjectById(projectId: number): Promise<Project> {
    return ProjectImpl.findOne({
      where: {
        id: projectId,
      },
      raw: true,
    });
  }

  public async addSubProjectsToProject(project, subProjects) {
    const projectRes: ProjectImpl = await ProjectImpl.findOne({
      where: { id: project.id },
      raw: false,
    });

    const subProjectIds = _.map(subProjects, (subProject): number => subProject.id);

    await projectRes.addProjects(subProjectIds);
  }
}
