import { Validator, InferValidator } from "../validator.ts";
import { ValidationError } from "../ValidationError.ts";

export const object = <
  T extends Record<string, any>,
  I = InferValidator<T>,
>(S: T) => {
  return new Validator<I>((V) => {
    if (typeof V !== "object") throw new ValidationError("object");

    const parsed: Record<string, any> = {};

    for (const key in S) {
      try {
        parsed[key] = S[key].test(V[key]);
      } catch (e) {
        if (e instanceof ValidationError) {
          throw new ValidationError(e.type, [key, ...e.path]);
        }
      }
    }

    return parsed as I;
  });
};
