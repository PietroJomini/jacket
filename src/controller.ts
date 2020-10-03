import type { Context, Middleware } from "../deps.ts";
import type { InferValidator, Validator } from "./schema/validator.ts";
import { ChainMiddleware, ChainHalt } from "./chain.ts";

export class Controller<S extends Validator<any>, Q = InferValidator<S>> {
  _schema: S;
  _chain: Array<[string, ChainMiddleware<Q>[]]>;
  _endpoint: ChainMiddleware<Q>;

  constructor(schema: S) {
    this._schema = schema;
    this._chain = [];
    this._endpoint = ({ ctx }) => ctx.response.body;
  }

  use(
    G: ChainMiddleware<Q> | Group<S>,
    ...M: ChainMiddleware<Q>[]
  ): Controller<S, Q> {
    this._chain.push(
      G instanceof Group
        ? [G._group, <ChainMiddleware<Q>[]> G._chain]
        : ["", [G, ...M]],
    );
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

  construct() {
    return async (ctx: Context) => {
      try {
        const query = this._schema.test(ctx.state.body);

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
      } catch (error) {
        ctx.response.body = { error };
      }
    };
  }
}

export class Group<S, Q = InferValidator<S>> {
  _chain: ChainMiddleware<Q>[];
  _group: string;

  constructor(G: string) {
    this._chain = [];
    this._group = G;
  }

  use(...M: ChainMiddleware<Q>[]) {
    this._chain = this._chain.concat(M);
    return this;
  }
}
