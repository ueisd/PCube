import { Role } from './role';

import * as _ from 'lodash';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  // tslint:disable-next-line:variable-name
  display_string?: string;

  constructor(userResponse?: any) {
    this.id = _.get(userResponse, 'id', 0);
    this.firstName = _.get(userResponse, 'firstName', '');
    this.lastName = _.get(userResponse, 'lastName', '');
    this.email = _.get(userResponse, 'email', '');

    // TODO uniformiser le output des getUsers
    const roleId = _.get(userResponse, 'role.id') || _.get(userResponse, 'RoleId', -1);
    const roleName = _.get(userResponse, 'role.name') || _.get(userResponse, 'Role.name', '');
    const roleAccessLevel = _.get(userResponse, 'role.accessLevel') || _.get(userResponse, 'Role.accessLevel', 0);

    this.role = new Role(roleId, roleName, roleAccessLevel);
    this.display_string = this.firstName + ' ' + this.lastName;
  }

  getFullName() {
    return [this.firstName, this.lastName].join(' ').trim();
  }

  equals(user: User): boolean {
    return !(
      this.id !== user.id ||
      this.email !== user.email ||
      this.firstName !== user.firstName ||
      this.lastName !== user.lastName ||
      this.role.name !== user.role.name ||
      this.role.id !== user.role.id ||
      this.display_string !== user.display_string ||
      this.role.accessLevel !== user.role.accessLevel
    );
  }
}
