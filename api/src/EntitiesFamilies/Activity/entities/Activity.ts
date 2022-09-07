"use strict";

export default class Activity {
  id: number;
  name: string;

  constructor({ id, name }: { id?: number; name: string }) {
    if (id) {
      this.id = id;
    }

    this.name = name;
  }
}
