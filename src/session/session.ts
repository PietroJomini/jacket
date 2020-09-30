import type { CookiesSetDeleteOptions, Middleware } from "../../deps.ts";
import { uuid } from "../../deps.ts";
import Store from "./store.ts";

export const middleware = (
  { sid = "SID", cookiesOptions = {} }: {
    sid?: string;
    cookiesOptions?: CookiesSetDeleteOptions;
  } = {},
): Middleware =>
  async ({ state, cookies }, next) => {
    if (!(state.session instanceof Store)) state.session = new Store();

    const id = cookies.get(sid) || uuid.generate();
    cookies.set(sid, id, cookiesOptions);
    state.session.use(id);

    await next();
  };
