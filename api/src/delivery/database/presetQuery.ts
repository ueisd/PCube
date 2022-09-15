import { execQueryNoDB } from './index';
import { getSequelize } from '../../configuration/sequelize';

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

  static truncateAll() {
    const sequelize = getSequelize();
    Object.values(sequelize.models).map((model: any) => {
      return model.destroy({ truncate: { cascade: true } });
    });
  }

  static closeConnection() {
    const sequelize = getSequelize();
    sequelize.close();
  }
}
