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

  sequelizeInst = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    // port: 3308,
    dialect: 'mysql',
  });

  return sequelizeInst;
}
