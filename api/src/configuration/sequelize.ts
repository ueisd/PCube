import { actualConfig } from './index';
const { Sequelize } = require('sequelize');

let sequelizeInst = undefined;

export function getSequelize() {
  if (sequelizeInst) {
    return sequelizeInst;
  }

  const config = {
    db: actualConfig.database_db,
    user: actualConfig.database_user,
    password: actualConfig.database_password,
    host: actualConfig.database_host,
  };

  const params: any = {
    host: config.host,
    dialect: 'mysql',
  };

  if (actualConfig.database_port) {
    params.port = actualConfig.database_port;
  }

  sequelizeInst = new Sequelize(config.db, config.user, config.password, params);

  return sequelizeInst;
}
