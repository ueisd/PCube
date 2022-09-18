'use strict';

// @ts-ignore
import { expect, jest, test, beforeAll, afterAll, beforeEach, afterEach, describe, it } from '@jest/globals';
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
      const admin = await userDbGateway.createRole(
        new Role({
          name: 'admin',
          accessLevel: 1,
        })
      );

      const userProps = {
        email: 'PM',
        firstName: 'monsieur',
        lastName: 'yota',
        password: 'pm',
        role: admin,
      };

      // Act
      const user = await userDbGateway.createUser(new User(userProps));

      // Assert
      expect(Asserter.extractAssertableUser(user)).toEqual(Asserter.extractAssertableExpectedUser(userProps));
    });
    test('With is active true', async () => {
      // Arrange
      const admin = await userDbGateway.createRole(
        new Role({
          name: 'admin',
          accessLevel: 1,
        })
      );

      const userProps = {
        email: 'PM',
        firstName: 'monsieur',
        lastName: 'yota',
        password: 'pm',
        isActive: true,
        role: admin,
      };

      // Act
      const user = await userDbGateway.createUser(new User(userProps));

      // Assert
      expect(Asserter.extractAssertableUser(user)).toEqual(Asserter.extractAssertableExpectedUser(userProps));
    });
  });

  describe('find User By Id', function () {
    test('With basic params', async () => {
      // Arrange
      const { user2 } = await Arranger.createDefaultUsers();

      // Act
      const foundUser = await userDbGateway.findUserById(user2.id);

      // Assert
      expect(Asserter.extractAssertableUser(foundUser, false)).toEqual(Asserter.extractAssertableUser(user2, false));
    });
  });

  describe('find User By Email', function () {
    test('With basic params', async () => {
      // Arrange
      const { user2 } = await Arranger.createDefaultUsers();

      // Act
      const foundUser = await userDbGateway.findUserByEmail(user2.email);

      // Assert
      expect(Asserter.extractAssertableUser(foundUser, false)).toEqual(Asserter.extractAssertableUser(user2, false));
    });
  });

  describe('find All Users Eager', function () {
    test('With basic params', async () => {
      // Arrange
      const { user1, user2, user3 } = await Arranger.createDefaultUsers();

      // Act
      const foundUsers = await userDbGateway.findAllUsersEager();

      // Assert
      expect(Asserter.extractAssertableUsers(foundUsers)).toEqual(Asserter.extractAssertableUsers([user3, user2, user1]));
    });
  });

  describe('find All Users', function () {
    test('With basic params', async () => {
      // Arrange
      const { user1, user2, user3 } = await Arranger.createDefaultUsers();

      // Act
      const foundUsers = await userDbGateway.findAllUsers();

      // Assert
      expect(Asserter.extractAssertableUsers(foundUsers)).toEqual(Asserter.extractAssertableUsers([user3, user2, user1]));
    });
  });

  describe('find All Roles', function () {
    test('With basic params', async () => {
      // Arrange
      const role1 = await userDbGateway.createRole(new Role({ name: 'role1', accessLevel: 1 }));
      const role2 = await userDbGateway.createRole(new Role({ name: 'role2', accessLevel: 1 }));
      const role3 = await userDbGateway.createRole(new Role({ name: 'role3', accessLevel: 1 }));

      // Act
      const foundRoles = await userDbGateway.findAllRoles();

      // Assert
      expect(Asserter.extractAssertableRoles(foundRoles)).toEqual(Asserter.extractAssertableRoles([role1, role2, role3]));
    });
  });

  describe('create Users', function () {
    test('With basic params', async () => {
      // Arrange
      const admin = await userDbGateway.createRole(
        new Role({
          name: 'admin',
          accessLevel: 1,
        })
      );

      const userProps = [
        {
          email: 'Kane@Nod.com',
          firstName: 'Kane',
          lastName: 'Nod',
          password: 'kane',
          RoleId: admin.id,
        },
        {
          email: 'Redmond@Boyle.com',
          firstName: 'Redmond',
          lastName: 'Boyle',
          password: 'redmond',
          RoleId: admin.id,
        },
        {
          email: 'Kirce@James.ca',
          firstName: 'Kirce',
          lastName: 'James',
          password: 'kirce',
          RoleId: admin.id,
        },
      ];

      // Act
      let users = await userDbGateway.createUsers(userProps);

      // Assert
      const foundUsers = await userDbGateway.findAllUsers();
      expect(Asserter.extractAssertableCreatedUsers(users)).toEqual(Asserter.extractAssertableListCreatedUsers(foundUsers).reverse());
      // expect(Asserter.extractAssertableCreatedUsers(users)).toEqual('');
    });
  });

  describe('update User', function () {
    test('With basic params', async () => {
      // Arrange
      const admin = await userDbGateway.createRole(
        new Role({
          name: 'admin',
          accessLevel: 1,
        })
      );

      const member = await userDbGateway.createRole(
        new Role({
          name: 'member',
          accessLevel: 2,
        })
      );

      let user = await userDbGateway.createUser({
        email: 'Kane@Nod.com',
        firstName: 'Kane',
        lastName: 'Nod',
        password: 'kane',
        RoleId: admin.id,
      });

      const updateUserProps = {
        email: 'Kane@Nod2.com',
        firstName: 'Kane2',
        lastName: 'Nod2',
        password: 'kane2',
        RoleId: member.id,
      };

      // Act
      await userDbGateway.updateUser(user.id, updateUserProps);

      // Assert
      const getUser = await userDbGateway.findUserById(user.id);
      expect(_.pick(getUser, ['email', 'firstName', 'lastName', 'password', 'RoleId'])).toEqual(updateUserProps);
    });
  });

  describe('Delete User', function () {
    test('With basic params', async () => {
      // Arrange
      const { user3 } = await Arranger.createDefaultUsers();

      // Act
      const deleteUserResp = await userDbGateway.deleteUser(user3.id);

      // Assert
      const getUser = await userDbGateway.findUserById(user3.id);

      expect(deleteUserResp).toEqual(1);
      expect(getUser).toBeNull();
    });
  });
});

class Arranger {
  public static async createDefaultUsers() {
    const admin = await userDbGateway.createRole(
      new Role({
        name: 'admin',
        accessLevel: 1,
      })
    );

    const userProps = {
      email: 'PM3',
      firstName: 'monsieur',
      lastName: 'yota',
      password: 'pm',
      role: admin,
    };

    const user1 = await userDbGateway.createUser(new User({ ...userProps, email: 'PM1' }));
    const user2 = await userDbGateway.createUser(new User({ ...userProps, email: 'PM2' }));
    const user3 = await userDbGateway.createUser(new User(userProps));

    return { user1, user2, user3 };
  }
}

class Asserter {
  public static extractAssertableRoles(roles) {
    return _.map(roles, (role) => Asserter.extractAssertableRole(role));
  }

  public static extractAssertableCreatedUsers(userResponse) {
    return _.map(userResponse, (userResp) => {
      return _.omit(userResp.dataValues, ['createdAt', 'updatedAt']);
    });
  }

  public static extractAssertableListCreatedUsers(userResponse) {
    return _.map(userResponse, (userResp) => {
      return _.omit(userResp, ['createdAt', 'updatedAt', 'isActive', 'role']);
    });
  }

  public static extractAssertableRole(role) {
    return _.omit(role, ['id', 'createdAt', 'updatedAt']);
  }

  public static extractAssertableUser(user, withRole = true) {
    if (withRole) {
      return _.omit(user, ['id', 'password']);
    }
    return _.pick(user, ['email', 'firstName', 'id', 'lastName', 'password']);
  }

  public static extractAssertableExpectedUser(user) {
    return _.omit(user, ['password']);
  }

  public static extractAssertableUsers(users) {
    return _.map(users, (fondUser) => Asserter.extractAssertableUser(fondUser, false));
  }
}

afterAll(async () => {
  PresetQuery.closeConnection();
});
