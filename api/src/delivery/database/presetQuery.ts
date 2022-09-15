import { execQueryNoDB } from './index';
import { getSequelize } from '../../configuration/sequelize';

import _ = require('lodash');
import * as console from 'console';

export class PresetQuery {
  static isDatabaseInResult(dbName, results) {
    if (!results) {
      return false;
    }
    for (let value of results) {
      if (dbName === Object.values(value)[0]) {
        return true;
      }
    }
    return false;
  }

  static ensureDBIsCreated = async (dbName) => {
    const databases = await execQueryNoDB(`SHOW DATABASES LIKE '${dbName}'`);

    if (PresetQuery.isDatabaseInResult(dbName, databases)) {
      return `La db ${dbName} existe deja`;
    }

    await execQueryNoDB(`CREATE DATABASE ${dbName}`);
    return `La db ${dbName} a été céée!`;
  };

  static async syncSchemas() {
    const sequelize = getSequelize();
    await sequelize.sync({ force: true });
  }

  static async clearAllCollections() {
    const sequelize = getSequelize();

    await executeWithoutForeingCheck(sequelize, async () => {
      const models = Object.values(sequelize.models);
      await Promise.all(
        _.map(models, async (model: any) => {
          await model.destroy({ truncate: { cascade: true } });
        })
      );
    });
  }

  static closeConnection() {
    const sequelize = getSequelize();
    sequelize.close();
  }
}

async function executeWithoutForeingCheck(sequelize, fn) {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  await fn();
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
}
