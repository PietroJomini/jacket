import { Validator } from "../validator.ts";
import { ValidationError } from "../Errors.ts";

export const date = new Validator((V) => {
  const D = new Date(V);
  if (!isNaN(D.getTime())) return D;
  throw new ValidationError("Date");
});
