import type { RouterMiddleware } from "../deps.ts";

export type HttpMethod = "GET" | "DELETE" | "PATCH" | "POST";

export type Route = {
  method: HttpMethod;
  route: string;
  callbacks: RouterMiddleware[];
};
