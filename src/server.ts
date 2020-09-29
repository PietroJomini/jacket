import { Application, Middleware } from "../deps.ts";
import type { Router } from "./router.ts";

import { errorHandler } from "./middlewares/error.ts";
import { bodyParser } from "./middlewares/bodyParser.ts";

export class Server {
  oak: Application;

  constructor() {
    this.oak = new Application();

    this.oak.use(errorHandler);
    this.oak.use(bodyParser);
  }

  public route(M: Router) {
    this.use(M.normalize().routes());
    return this;
  }

  public use(M: Middleware) {
    this.oak.use(M);
    return this;
  }

  public listen({ port }: { port: number }) {
    this.oak.listen({ port });
  }
}
