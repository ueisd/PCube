'use strict';

// @ts-ignore
import { expect, jest, test, beforeAll } from '@jest/globals';
import _ = require('lodash');

import UserDataBaseGatewayImpl from '../../../../src/EntitiesFamilies/User/databaseImpls/databaseGateway.impl';
import Role from '../../../../src/EntitiesFamilies/User/entities/role';
import { loadConfig, actualConfig } from '../../../../src/configuration';
import { getSequelize } from '../../../../src/configuration/sequelize';

let userDbGateway;

beforeAll(async () => {
  await loadConfig();
  actualConfig.database_host = 'localhost';
  actualConfig.database_port = 3308;

  const sequelize = getSequelize();
  userDbGateway = new UserDataBaseGatewayImpl(sequelize);
});

test('Create role', async () => {
  const admin = await userDbGateway.createRole(
    new Role({
      name: 'admin',
      accessLevel: 1,
    })
  );

  expect(_.omit(JSON.parse(JSON.stringify(admin)), ['id'])).toStrictEqual({ accessLevel: 1, name: 'admin' });
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
