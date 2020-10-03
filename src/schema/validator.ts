import { ValidationError, VerificationError } from "./Errors.ts";

export type FunctionType<R = any, P extends unknown[] = any[]> = (
  ...args: P
) => R;

export class Validator<D> {
  public readonly test: FunctionType<D>;

  constructor(test: FunctionType<D>) {
    this.test = test;
  }

  optional(def: D | undefined = undefined) {
    return new Validator<typeof def>((V?) => {
      if (V === null || V === "" || V === undefined) return def;
      return this.test(V);
    });
  }

  transform(trans: FunctionType<D>) {
    return new Validator<D>((V) => this.test(trans(V)));
  }

  verify(cond: FunctionType<boolean>, desc?: string) {
    return new Validator<D>((V) => {
      const tested = this.test(V);
      if (cond(tested)) return tested;
      throw new VerificationError(
        `Validation error${desc ? ` : ${desc}` : ""}`,
      );
    });
  }
}

export type LiteralTypes = {
  number: number;
  string: string;
};

export const literalValidator = <T extends keyof LiteralTypes>(literal: T) =>
  new Validator((V) => {
    if (typeof V === literal) return V as LiteralTypes[T];
    throw new ValidationError(literal);
  });

export type InferValidator<V> = V extends Validator<infer X> ? X
  : V extends Record<any, any> ? { [K in keyof V]: InferValidator<V[K]> }
  : unknown;
