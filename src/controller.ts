import type { Context } from "../deps.ts";
import type { InferValidator, Validator } from "./schema/validator.ts";
import { ChainMiddleware, ChainHalt } from "./chain.ts";
import * as types from "./schema/types/index.ts";

export class Controller<S extends Validator<any>, Q = InferValidator<S>> {
  _schema: S;
  _chain: Array<[string, ChainMiddleware<Q>[]]>;
  _endpoint: ChainMiddleware<Q>;

  constructor(schema?: S) {
    this._schema = schema || types.null as S;
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

        let GP: any;
        const P: Record<string, any> = {};
        for await (const [group, middlewares] of this._chain) {
          for await (const middleware of middlewares) {
            const MP = await middleware({ query, payload: P[group], ctx });
            if (MP instanceof ChainHalt) return ctx.response.body = MP.body();
            if (MP !== null && MP !== undefined) P[group] = MP;
          }
          GP = P[group];
        }

        ctx.response.body = this._endpoint({ query, payload: GP, ctx });
      } catch (error) {
        ctx.response.body = { error };
      }
    };
  }
}

export class Group<S, Q = InferValidator<S>> {
  static for<S extends Validator<any>>(C: Controller<S>, G: string) {
    return new Group<S>(G);
  }

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
