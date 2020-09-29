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

  public route(M: Router): void {
    this.oak.use(M.normalize().routes());
  }

  public listen({ port }: { port: number }) {
    this.oak.listen({ port });
  }
}