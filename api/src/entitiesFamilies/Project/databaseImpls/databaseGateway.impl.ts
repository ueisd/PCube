"use strict";

import ProjectImpl from "./ProjectImpl";
import Project from "../entities/Project";
import _ = require("lodash");
import ProjectDatabaseGateway from "../databaseGateway/ProjectDatabaseGateway";

export default class ProjectDataBaseGatewayImpl
  implements ProjectDatabaseGateway
{
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    ProjectImpl.initModel(sequelize);
  }

  public async createProject(props: { name: string }): Promise<Project> {
    const projectModel = {
      name: props.name,
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

  public async addSubProjectsToProject(project, subProjects): Promise<void> {
    const projectRes: ProjectImpl = await ProjectImpl.findOne({
      where: {
        id: project.id,
      },
      raw: false,
    });

    const subProjectIds = _.map(
      subProjects,
      (subProject): number => subProjects.id
    );

    // fonctionne PLM
    // const newProj = await caca.setProject(caca2);

    await projectRes.addProjects(subProjectIds);

    // const projetsList = await projectRes.getProjects();
    // console.log("S".repeat(100));
    // console.log(JSON.stringify({ projetsList }, null, 2));
  }
}
