import { serve } from "https://deno.land/std/http/server.ts";
import type {
  HTTPOptions,
  ServerRequest,
  Response as ServerResponse,
} from "https://deno.land/std/http/server.ts";

export type Handler = (
  R: ServerRequest,
) => ServerResponse | Promise<ServerResponse>;

export class Server {
  private handler: Handler;

  constructor(handler: Handler, options?: { port: number }) {
    this.handler = handler;
    if (options?.port) this.listen({ port: options.port });
  }

  async listen(options: HTTPOptions) {
    for await (const request of serve(options)) {
      this.handleRequest(request);
    }
  }

  private async handleRequest(request: ServerRequest) {
    // TODO parse request
    const response = await this.handler(request);

    // TODO parse response
    request.respond(response);
  }
}
