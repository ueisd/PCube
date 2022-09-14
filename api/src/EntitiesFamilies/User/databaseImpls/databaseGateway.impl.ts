'use strict';

import _ = require('lodash');
const bcrypt = require('bcrypt');

import RoleImpl from './roleImpl';
import UserImpl from './userImpl';

import Role from '../entities/role';
import User from '../entities/User';
import UserDatabaseGateway from '../databaseGateway/UserDatabaseGateway';
import { getSequelize } from '../../../configuration/sequelize';

export default class UserDataBaseGatewayImpl implements UserDatabaseGateway {
  private sequelize;

  constructor(sequelize) {
    this.sequelize = getSequelize();

    RoleImpl.initModel(this.sequelize);
    UserImpl.initModel(this.sequelize);

    // role
    RoleImpl.hasMany(UserImpl);
    UserImpl.belongsTo(RoleImpl);
  }

  public async findUserByEmail(email: string): Promise<User> {
    return UserImpl.findOne({
      where: { email: email },
      include: [{ model: RoleImpl }],
      raw: true,
    });
  }

  public async findUserById(id): Promise<User> {
    return UserImpl.findByPk(id, {
      include: [{ model: RoleImpl }],
      raw: true,
    });
  }

  public async createRole(role: Role): Promise<Role> {
    const response = await RoleImpl.create(role);

    return new Role({
      id: response.id,
      name: response.name,
      accessLevel: response.accessLevel,
    });
  }

  public async createUser(user: User): Promise<User> {
    const userModel = UserDataBaseGatewayImpl.fetchUserModel(user);
    UserDataBaseGatewayImpl.encryptUserPassword(userModel);

    const result = await UserImpl.create(userModel);

    return UserDataBaseGatewayImpl.buildUserResponse(result, user);
  }

  public async updateUser(id: number, props: any): Promise<User> {
    return UserImpl.update(props, { where: { id } });
  }

  public async deleteUser(id: number): Promise<any> {
    return UserImpl.destroy({
      where: { id: id },
    });
  }

  public async createUsers(users: User[]): Promise<User[]> {
    const userModels = UserDataBaseGatewayImpl.fetchUserListModel(users);
    _.forEach(userModels, (uM) => UserDataBaseGatewayImpl.encryptUserPassword(uM));

    const createdUsers = await UserImpl.bulkCreate(userModels);

    return UserDataBaseGatewayImpl.buildUserListResponse(createdUsers, users);
  }

  public async findAllRoles(): Promise<Role[]> {
    return RoleImpl.findAll({ raw: true });
  }

  public async findAllUsersEager(): Promise<User[]> {
    const eagerUserListModel = await UserImpl.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: this.sequelize.models.Role,
        },
      ],
      raw: true,
    });

    return _.map(eagerUserListModel, (userModel) => UserDataBaseGatewayImpl.buildUserResponseFromEager(userModel));
  }

  private static encryptUserPassword(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
  }

  private static fetchUserModel(user: User) {
    const userModels = _.omit(user, ['role']);

    if (user.role) {
      userModels.RoleId = user.role.id;
    }

    return userModels;
  }

  private static buildUserResponse(userModel, user) {
    const createdUser = new User({
      id: userModel.id,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      email: userModel.email,
      password: userModel.password,
      isActive: userModel.isActive,
    });

    if (user.role && userModel.RoleId) {
      createdUser.role = user.role;
    }

    return createdUser;
  }

  private static buildUserResponseFromEager(userModel) {
    const user = new User({
      id: userModel.id,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      email: userModel.email,
      password: userModel.password,
      isActive: userModel.isActive,
    });

    if (userModel['Role.id']) {
      user.role = new Role({
        id: userModel['Role.id'],
        name: userModel['Role.name'],
        accessLevel: userModel['Role.accessLevel'],
      });
    }

    return user;
  }

  private static fetchUserListModel(users: User[]) {
    return _.map(users, (u) => UserDataBaseGatewayImpl.fetchUserModel(u));
  }
  private static buildUserListResponse(createdUsers, users) {
    return _.map(createdUsers, (res, index) => {
      const us = users[index];
      return UserDataBaseGatewayImpl.buildUserResponse(res, us);
    });
  }
}
