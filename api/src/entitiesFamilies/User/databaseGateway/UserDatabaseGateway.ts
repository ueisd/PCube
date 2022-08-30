"use strict";

import Role from "../entities/role";
import User from "../entities/User";

export default interface UserDatabaseGateway {
  createRole(role: Role): Promise<Role>;
  createUser(user: User): Promise<User>;
  createUsers(users: User[]): Promise<User[]>;
  findAllUsersEager(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id): Promise<User>;
  findAllRoles(): Promise<Role[]>;
}
