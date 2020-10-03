import { Validator, InferValidator } from "../validator.ts";

export const object = <
  T extends Record<string, any>,
  I = InferValidator<T>,
>(S: T) => {
  return new Validator<I>((V) => {
    if (typeof V !== "object") throw new TypeError("Expected to be object");
    const parsed: Record<string, any> = {};
    for (const key in S) {
      parsed[key] = S[key].test(V[key]);
    }
    return parsed as I;
  });
};
