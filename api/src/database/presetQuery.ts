import { execQueryNoDB } from "./index";
import { getSequelize } from "../configuration/sequelize";

export class PresetQuery {
  static isDatabaseInResult(dbName, results) {
    if (!results) return false;
    for (let value of results)
      if (dbName === Object.values(value)[0]) return true;
    return false;
  }

  static ensureDBIsCreated = async (dbName) => {
    const databases = await execQueryNoDB(`SHOW DATABASES LIKE '${dbName}'`);
    if (!PresetQuery.isDatabaseInResult(dbName, databases)) {
      await execQueryNoDB(`CREATE DATABASE ${dbName}`);
      return "DB céée!";
    } else return "db existante";
  };

  static async syncSchemas() {
    const sequelize = getSequelize();
    return sequelize.sync({ force: true });
  }
}
