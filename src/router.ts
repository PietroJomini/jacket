import { Router as OakRouter, RouterMiddleware } from "../deps.ts";
import type { Route, HttpMethod } from "./router.d.ts";

export class Router {
  routes: Route[];

  constructor() {
    this.routes = [];
  }

  register(
    method: HttpMethod,
    route: string,
    callbacks: Array<RouterMiddleware>,
  ): Router {
    this.routes.push({
      method,
      route,
      callbacks,
    });
    return this;
  }

  get(route: string, ...callbacks: RouterMiddleware[]): Router {
    this.register("GET", route, callbacks);
    return this;
  }
  delete(route: string, ...callbacks: RouterMiddleware[]): Router {
    this.register("DELETE", route, callbacks);
    return this;
  }
  patch(route: string, ...callbacks: RouterMiddleware[]): Router {
    this.register("PATCH", route, callbacks);
    return this;
  }
  post(route: string, ...callbacks: RouterMiddleware[]): Router {
    this.register("POST", route, callbacks);
    return this;
  }

  use(route: string, router: Router): Router {
    for (const subRoute of router.routes) {
      if (subRoute.method === "GET") {
        this.get(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "DELETE") {
        this.delete(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "PATCH") {
        this.patch(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "POST") {
        this.post(route + subRoute.route, ...subRoute.callbacks);
      }
    }
    return this;
  }

  normalize(): OakRouter {
    const oakRouter = new OakRouter();
    for (const route of this.routes) {
      if (route.method === "GET") {
        oakRouter.get(route.route, ...route.callbacks);
      } else if (route.method === "DELETE") {
        oakRouter.delete(route.route, ...route.callbacks);
      } else if (route.method === "PATCH") {
        oakRouter.patch(route.route, ...route.callbacks);
      } else if (route.method === "POST") {
        oakRouter.post(route.route, ...route.callbacks);
      }
    }
    return oakRouter;
  }
}
