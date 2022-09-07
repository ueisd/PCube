export default class Role {
  id: number;
  name?: string;
  accessLevel?: number;

  constructor({ id, name, accessLevel }: { id?: number; name: string; accessLevel: number }) {
    if (id) {
      this.id = id;
    }

    this.name = name;
    this.accessLevel = accessLevel;
  }
}
