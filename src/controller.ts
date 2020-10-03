import type { Context, Middleware } from "../deps.ts";
import type { Infer } from "./schema.ts";
import { ChainMiddleware, ChainHalt } from "./chain.ts";

export class Controller<S, Q = Infer<S>> {
  _schema: S;
  _chain: Array<[string, ChainMiddleware<Q>[]]>;
  _endpoint: ChainMiddleware<Q>;

  constructor(schema: S) {
    this._schema = schema;
    this._chain = [];
    this._endpoint = ({ ctx }) => ctx.response.body;
  }

  use(...M: ChainMiddleware<Q>[]): Controller<S, Q> {
    this._chain.push(["", M]);
    return this;
  }

  group(G: string, ...M: ChainMiddleware<Q>[]): Controller<S, Q> {
    this._chain.push([G, M]);
    return this;
  }

  endpoint(E: ChainMiddleware<Q>): Controller<S, Q> {
    this._endpoint = E;
    return this;
  }

  construct(): Middleware {
    const validator = (this._schema as any).destruct();

    return async (ctx: Context) => {
      const [err, query] = validator(ctx.state.body);
      if (err) return ctx.response.body = err;

      let GPayload: any;
      for await (const [group, middlewares] of this._chain) {
        let payload: any;
        for await (const middleware of middlewares) {
          const MP = await middleware({ query, payload, ctx });
          if (MP instanceof ChainHalt) return ctx.response.body = MP.body();
          if (MP !== null && MP !== undefined) payload = MP;
        }
        GPayload = payload;
      }

      ctx.response.body = this._endpoint({ query, payload: GPayload, ctx });
    };
  }
}
