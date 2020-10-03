import { Validator, InferValidator } from "../validator.ts";
import { ValidationError, PathlikeError } from "../Errors.ts";

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
        if (e instanceof PathlikeError) {
          e.path = [key, ...e.path];
          throw e;
        }
      }
    }

    return parsed as I;
  });
};
