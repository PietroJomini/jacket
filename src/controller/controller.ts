import type { Context, Middleware } from "../../deps.ts";
import type { Infer } from "../schema.ts";

export type ControllerCallback<Q> = (P: {
  query: Q;
  patload: any;
  ctx: Context;
}) => any | Promise<any>;

export type Controller<Q = any> = {
  use: (callback: ControllerCallback<Q>) => Controller<Q>;
  construct: () => Middleware;
};

export const controller = <S, Q = Infer<S>>(
  schema: S,
  chain: ControllerCallback<Q>[] = [],
): Controller<Q> => ({
  use: (C: ControllerCallback<Q>) => controller(schema, [...chain, C]),
  construct: () => {
    const validator = (schema as any).destruct();

    return async (ctx: Context) => {
      const [err, query] = validator(ctx.state.body);
      if (err) return (ctx.response.body = err);

      console.log(chain);
      ctx.response.body = query;
    };
  },
});
