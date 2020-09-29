import type { Context, SchemaInfer } from "../../deps.ts";

export type ControllerCallback<T> = (P: {
  query: T;
  patload: any;
  ctx: Context;
}) => any | Promise<any>;

export class Controller<T, K = SchemaInfer<T>> {
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

    // get trough chain

    return async (ctx: Context) => {
      ctx.response.body = "HEY HEY HEY";
    };
  }
}
