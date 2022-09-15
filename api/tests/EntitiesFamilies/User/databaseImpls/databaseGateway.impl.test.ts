'use strict';

// @ts-ignore
import { expect, jest, test, beforeAll, afterAll, beforeEach, afterEach, describe } from '@jest/globals';
import _ = require('lodash');

import UserDataBaseGatewayImpl from '../../../../src/EntitiesFamilies/User/databaseImpls/databaseGateway.impl';
import Role from '../../../../src/EntitiesFamilies/User/entities/role';
import { loadConfig, actualConfig } from '../../../../src/configuration';
import { PresetQuery } from '../../../../src/delivery/database/presetQuery';
import User from '../../../../src/EntitiesFamilies/User/entities/User';

let userDbGateway;

beforeAll(async () => {
  await loadConfig();
  actualConfig.database_host = 'localhost';
  actualConfig.database_port = 3309;
  actualConfig.db_logging = false;

  await PresetQuery.ensureDBIsCreated(actualConfig.database_db);

  userDbGateway = new UserDataBaseGatewayImpl();

  await PresetQuery.syncSchemas();
});

afterEach(async () => {
  await PresetQuery.clearAllCollections();
});

describe('Database Gateway implement', () => {
  describe('Create Role', () => {
    test('With basic params', async () => {
      // Arrange
      const params = {
        name: 'Zarathustra',
        accessLevel: 1,
      };

      // Act
      const admin = await userDbGateway.createRole(new Role(params));

      // Assert
      expect(Asserter.extractAssertableRole(admin)).toEqual(params);
    });
  });
  describe('Create User', () => {
    test('With basic params', async () => {
      // Arrange
      const roleProps = {
        name: 'admin',
        accessLevel: 1,
      };
      const admin = await userDbGateway.createRole(new Role(roleProps));

      // Act
      const user = await userDbGateway.createUser(
        new User({
          email: 'PM',
          firstName: 'monsieur',
          lastName: 'yota',
          password: 'pm',
          role: admin,
        })
      );

      // Assert
      expect(Asserter.extractAssertableRole(admin)).toEqual(roleProps);
      expect(Asserter.extractAssertableUser(user)).toEqual({
        email: 'PM',
        firstName: 'monsieur',
        lastName: 'yota',
        role: roleProps,
      });
    });
  });
});

class Asserter {
  public static extractAssertableRole(role) {
    return _.omit(role, ['id']);
  }

  public static extractAssertableUser(user) {
    return _.omit(user, ['id', 'password', 'role.id']);
  }
}

afterAll(async () => {
  PresetQuery.closeConnection();
});
