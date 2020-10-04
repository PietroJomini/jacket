import { Validator, InferValidator } from "../validator.ts";
import { ValidationError, PathlikeError } from "../Errors.ts";

// export const array = <
//   T extends Validator<any>,
//   I = InferValidator<T[]>,
// >(S: T) => {
//   return new Validator<I>((V) => {
//     try {
//       V = JSON.parse(V);
//     } catch (error) {
//       throw new ValidationError("array");
//     }

//     if (!Array.isArray(V)) throw new ValidationError("array");

//     const parsed: T[] = [];

//     V.forEach((E, I) => {
//       try {
//         parsed.push(S.test(E));
//       } catch (e) {
//         if (e instanceof PathlikeError) {
//           e.path = [I.toString(), ...e.path];
//           throw e;
//         }
//       }
//     });

//     return parsed as unknown as I;
//   });
// };

export class ArrayValidator<D extends unknown[]> extends Validator<D> {
  of<T extends Validator<any>>(S: T) {
    return new Validator((V) => {
      const parsed: D[] = [];
      this.test(V).forEach((E, I) => {
        try {
          parsed.push(S.test(E));
        } catch (e) {
          if (e instanceof PathlikeError) {
            e.path = [I.toString(), ...e.path];
            throw e;
          }
        }
      });
      return parsed;
    });
  }
}

export const array = new ArrayValidator((V) => {
  try {
    if (typeof V === "string") V = JSON.parse(V);
    console.log(V);
    if (!Array.isArray(V)) throw "";
    return V;
  } catch (_) {
    throw new ValidationError("array");
  }
});
