import { Router as OakRouter, Middleware } from "../deps.ts";
import type { Controller } from "./controller/controller.ts";

export type HttpMethod = "GET" | "DELETE" | "PATCH" | "POST";

export type Route = {
  method: HttpMethod;
  route: string;
  controller: Controller<any>;
};

export class Router {
  routes: Route[];

  constructor() {
    this.routes = [];
  }

  register(M: HttpMethod, R: string, C: Controller<any>): Router {
    this.routes.push({ method: M, route: R, controller: C });
    return this;
  }

  get(R: string, C: Controller<any>) {
    this.register("GET", R, C);
    return this;
  }
  post(R: string, C: Controller<any>) {
    this.register("POST", R, C);
    return this;
  }
  patch(R: string, C: Controller<any>) {
    this.register("PATCH", R, C);
    return this;
  }
  delete(R: string, C: Controller<any>) {
    this.register("DELETE", R, C);
    return this;
  }

  use(route: string, router: Router): Router {
    for (const subRoute of router.routes) {
      if (subRoute.method === "GET") {
        this.get(route + subRoute.route, subRoute.controller);
      } else if (subRoute.method === "DELETE") {
        this.delete(route + subRoute.route, subRoute.controller);
      } else if (subRoute.method === "PATCH") {
        this.patch(route + subRoute.route, subRoute.controller);
      } else if (subRoute.method === "POST") {
        this.post(route + subRoute.route, subRoute.controller);
      }
    }
    return this;
  }

  normalize(): OakRouter {
    const oakRouter = new OakRouter();
    for (const route of this.routes) {
      if (route.method === "GET") {
        oakRouter.get(route.route, route.controller.callback());
      } else if (route.method === "DELETE") {
        oakRouter.delete(route.route, route.controller.callback());
      } else if (route.method === "PATCH") {
        oakRouter.patch(route.route, route.controller.callback());
      } else if (route.method === "POST") {
        oakRouter.post(route.route, route.controller.callback());
      }
    }
    return oakRouter;
  }
}
