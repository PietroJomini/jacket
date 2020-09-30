import { uuid } from "../../deps.ts";

export default class Store {
  records: Record<string, Record<string, string>>;
  id: string;

  constructor(id = "") {
    this.records = {};
    this.id = id;
  }

  use(id: string): Store {
    if (!uuid.validate(id)) throw new Error("ID must be a valid uuid");
    if (!this.records[id]) this.records[id] = {};
    this.id = id;
    return this;
  }

  get(key: string): string | undefined {
    return this.records[this.id][key];
  }

  set(key: string, value: string): Store {
    this.records[this.id][key] = value;
    return this;
  }
}
