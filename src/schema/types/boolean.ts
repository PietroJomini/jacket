import { Validator } from "../validator.ts";
import { ValidationError } from "../Errors.ts";

export const boolean = new Validator((V) => {
  if (V === "true") return true;
  if (V === "false") return false;
  throw new ValidationError("boolean");
});
