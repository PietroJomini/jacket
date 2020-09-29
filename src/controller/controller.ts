import type { Context } from "../../deps.ts";
import type { Infer } from "../schema.ts";

export type ControllerCallback<T> = (P: {
  query: T;
  patload: any;
  ctx: Context;
}) => any | Promise<any>;

export class Controller<T, K = Infer<T>> {
  schema: T;
  chain: ControllerCallback<K>[];

  constructor(schema: T) {
    this.schema = schema;
    this.chain = [];
  }

  use(C: ControllerCallback<K>) {
    this.chain.push(C);
    return this;
  }

  callback() {
    const validator = (<any> this.schema).destruct();

    return async (ctx: Context) => {
      const [err, query] = validator(ctx.state.body);

      ctx.response.body = err || query;
    };
  }
}
