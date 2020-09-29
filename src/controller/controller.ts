import type { Context, Middleware } from "../../deps.ts";
import type { Infer } from "../schema.ts";
import { ChainMiddleware, ChainHalt } from "./chain.ts";

export type Controller<Q = any> = {
  use: (callback: ChainMiddleware<Q>) => Controller<Q>;
  construct: () => Middleware;
};

export const controller = <S, Q = Infer<S>>(
  schema: S,
  chain: ChainMiddleware<Q>[] = [],
): Controller<Q> => ({
  use: (C: ChainMiddleware<Q>) => controller(schema, [...chain, C]),
  construct: () => {
    const validator = (schema as any).destruct();

    return async (ctx: Context) => {
      const [err, query] = validator(ctx.state.body);
      if (err) return ctx.response.body = err;

      let payload: any;
      for await (const middleware of chain) {
        const MP = await middleware({ query, payload, ctx });
        if (MP instanceof ChainHalt) return ctx.response.body = MP.body();
        if (MP) payload = MP;
      }

      if (!ctx.response.body) ctx.response.body = payload;
    };
  },
});
