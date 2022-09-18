'use strict';

import Role from '../entities/role';
import User from '../entities/User';

export default interface UserDatabaseGateway {
  createRole(role: Role): Promise<Role>;
  createUser(user: User): Promise<User>;
  updateUser(id: number, props: any): Promise<User>;
  createUsers(users: CreateUserProps[]): Promise<User[]>;
  findAllUsersEager(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id): Promise<User>;
  findAllRoles(): Promise<Role[]>;
  deleteUser(id: number): Promise<any>;
}

export type CreateUserProps = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  RoleId?: number;
};
