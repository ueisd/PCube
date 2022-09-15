'use strict';

// @ts-ignore
import { expect, jest, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
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
});

beforeEach(async () => {
  await PresetQuery.syncSchemas();
});

test('Create role', async () => {
  const admin = await userDbGateway.createRole(
    new Role({
      name: 'Zarathustra',
      accessLevel: 1,
    })
  );

  expect(_.omit(JSON.parse(JSON.stringify(admin)), ['id'])).toStrictEqual({ accessLevel: 1, name: 'Zarathustra' });
});

test('Create role 2', async () => {
  const admin = await userDbGateway.createRole(
    new Role({
      name: 'admin',
      accessLevel: 1,
    })
  );
  expect(_.omit(JSON.parse(JSON.stringify(admin)), ['id'])).toStrictEqual({ accessLevel: 1, name: 'admin' });
});

test('Create User', async () => {
  const roleProps = {
    name: 'admin',
    accessLevel: 1,
  };

  const admin = await userDbGateway.createRole(new Role(roleProps));

  const user = await userDbGateway.createUser(
    new User({
      email: 'PM',
      firstName: 'monsieur',
      lastName: 'yota',
      password: 'pm',
      role: admin,
    })
  );

  expect(getAssertableFields(admin)).toStrictEqual({ accessLevel: 1, name: 'admin' });
  expect(getAssertableUser(user)).toStrictEqual({
    email: 'PM',
    firstName: 'monsieur',
    lastName: 'yota',
    role: roleProps,
  });
});

function getAssertableFields(role) {
  return _.omit(asJson(role), ['id']);
}

function getAssertableUser(role) {
  return _.omit(asJson(role), ['id', 'password', 'role.id']);
}

function asJson(object) {
  return JSON.parse(JSON.stringify(object));
}

afterAll(async () => {
  PresetQuery.closeConnection();
});
