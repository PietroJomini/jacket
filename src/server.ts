import { Application, Middleware } from "../deps.ts";
import type { Router } from "./router/router.ts";

export class Server {
  oak: Application;

  constructor() {
    this.oak = new Application();
  }

  public route(M: Router): void {
    this.oak.use(M.normalize().routes());
  }

  public listen({ port }: { port: number }) {
    this.oak.listen({ port });
  }
}
