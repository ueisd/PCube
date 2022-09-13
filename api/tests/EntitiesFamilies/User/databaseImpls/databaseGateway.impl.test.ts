'use strict';

// @ts-ignore
import { expect, jest, test } from '@jest/globals';

import UserDataBaseGatewayImpl from '../../../../src/EntitiesFamilies/User/databaseImpls/databaseGateway.impl';
import Role from '../../../../src/EntitiesFamilies/User/entities/role';
import { loadConfig } from '../../../../src/configuration';
import { getSequelize } from '../../../../src/configuration/sequelize';

test('Create role', async () => {
  await loadConfig();
  const sequelize = getSequelize();
  const userDbGateway = new UserDataBaseGatewayImpl(sequelize);
  try {
    const admin = await userDbGateway.createRole(
      new Role({
        name: 'admin',
        accessLevel: 1,
      })
    );
  } catch (err) {
    console.log(err);
  }

  //
  // expect(admin).toBe({});
});
