export class PathlikeError extends Error {
  path: string[];
  constructor(msg: string, path: string[] = []) {
    super(msg);
    this.name = "PathlikeError";
    this.path = path;
  }
}

export class ValidationError extends PathlikeError {
  type: string;
  constructor(type: string, path: string[] = []) {
    super(`Expected to be ${type}`, path);
    this.name = "ValidationError";
    this.type = type;
  }
}

export class VerificationError extends PathlikeError {
  constructor(msg: string = "VerificationError", path: string[] = []) {
    super(msg, path);
    this.name = "VerificationError";
  }
}
