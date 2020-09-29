import type { Context } from "../deps.ts";

export type ChainMiddleware<Q> = (P: {
  query: Q;
  payload: any;
  ctx: Context;
}) => any | Promise<any>;

export type ChainHaltPayload = {
  msg?: string;
  status?: number;
};

type ChainHaltP = {
  msg?: string;
  status?: number;
};

export class ChainHalt {
  status: number;
  msg: string;
  constructor({ msg = "halt", status = 500 }: ChainHaltP = {}) {
    this.msg = msg;
    this.status = status;
  }

  body() {
    return { msg: this.msg, status: this.status };
  }
}

export const ensure = (
  C: boolean,
  P: ChainHaltP,
) => !C ? new ChainHalt(P) : null;
