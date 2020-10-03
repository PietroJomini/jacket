export class ValidationError extends Error {
  path: string[];
  type: string;
  constructor(type: string, path: string[] = []) {
    super(`Expected to be ${type}`);
    this.name = "ValidationError";

    this.path = path;
    this.type = type;
  }
}
