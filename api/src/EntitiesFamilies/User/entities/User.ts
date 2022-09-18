import Role from './role';

export default class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  role: Role;
  RoleId?: number;
  createdAt?;

  constructor({ id, firstName, lastName, email, password, isActive, role }: { id?: number; firstName: string; lastName: string; email: string; password: string; isActive?: boolean; role?: Role }) {
    if (id) {
      this.id = id;
    }

    if (isActive) {
      this.isActive = isActive;
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
