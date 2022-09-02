import { Role } from './role';

import * as _ from 'lodash';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // tslint:disable-next-line:variable-name
  display_string?: string;
  role: Role;

  constructor(props?: any) {
    this.id = _.get(props, 'id', 0);
    this.firstName = _.get(props, 'firstName', '');
    this.lastName = _.get(props, 'lastName', '');
    this.email = _.get(props, 'email', '');
    this.display_string = `${this.firstName} ${this.lastName}`;
    this.role = extractRoleFromProps(props);
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

// TODO uniformiser le output des getUsers
function extractRoleFromProps(props): Role {
  const roleId = _.get(props, 'role.id') || _.get(props, 'RoleId', -1);
  const roleName = _.get(props, 'role.name') || _.get(props, 'Role.name', '');
  const roleAccessLevel = _.get(props, 'role.accessLevel') || _.get(props, 'Role.accessLevel', 0);
  return new Role(roleId, roleName, roleAccessLevel);
}
