'use strict';

import _ = require('lodash');
const bcrypt = require('bcrypt');

import RoleImpl from './roleImpl';
import UserImpl from './userImpl';

import Role from '../entities/role';
import User from '../entities/User';
import UserDatabaseGateway, { CreateUserProps } from '../databaseGateway/UserDatabaseGateway';
import { getSequelize } from '../../../configuration/sequelize';

export default class UserDataBaseGatewayImpl implements UserDatabaseGateway {
  private readonly sequelize;

  constructor() {
    this.sequelize = getSequelize();

    RoleImpl.initModel(this.sequelize);
    UserImpl.initModel(this.sequelize);

    // role
    RoleImpl.hasMany(UserImpl);
    UserImpl.belongsTo(RoleImpl);
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

  public async findUserById(id): Promise<User> {
    return UserImpl.findByPk(id, {
      include: [{ model: RoleImpl }],
      raw: true,
    });
  }

  public async findUserByEmail(email: string): Promise<User> {
    return UserImpl.findOne({
      where: { email: email },
      include: [{ model: RoleImpl }],
      raw: true,
    });
  }

  public async findAllUsersEager(): Promise<User[]> {
    const eagerUserListModel = await UserImpl.findAll({
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          model: this.sequelize.models.Role,
        },
      ],
      raw: true,
    });

    return _.map(eagerUserListModel, (userModel) => UserDataBaseGatewayImpl.buildUserResponseFromEager(userModel));
  }

  public async findAllUsers(): Promise<User[]> {
    return UserImpl.findAll({
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      raw: true,
    });
  }

  public async findAllRoles(): Promise<Role[]> {
    return RoleImpl.findAll({ raw: true });
  }

  public async createUsers(createUsersProps: CreateUserProps[]): Promise<User[]> {
    const userModels = createUsersProps;
    _.forEach(userModels, (uM) => UserDataBaseGatewayImpl.encryptUserPassword(uM));

    return UserImpl.bulkCreate(userModels);
  }

  public async updateUser(id: number, props: any): Promise<User> {
    return UserImpl.update(props, { where: { id } });
  }

  public async deleteUser(id: number): Promise<any> {
    return UserImpl.destroy({
      where: { id: id },
    });
  }

  // Service methods

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
}
