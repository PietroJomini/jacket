import { serve } from "https://deno.land/std/http/server.ts";
import type {
  HTTPOptions,
  ServerRequest,
  Response as ServerResponse,
  Server as DenoServer,
} from "https://deno.land/std/http/server.ts";

export type Handler = (
  R: ServerRequest,
) => void | ServerResponse | Promise<void | ServerResponse>;

export class Server {
  private handler?: Handler;
  private listener?: DenoServer;

  constructor(handler?: Handler, options?: { port: number }) {
    this.handler = handler;
    if (options?.port) this.listen({ port: options.port });
  }

  handle(handler: Handler) {
    this.handler = handler;
    return this;
  }

  async listen(options: HTTPOptions) {
    this.listener = serve(options);
    for await (const request of this.listener) {
      this.handleRequest(request);
    }
  }

  close() {
    this.listener?.close();
  }

  private async handleRequest(request: ServerRequest) {
    // TODO parse request
    const response = await this.handler?.(request);

    // TODO parse response
    if (response) request.respond(response);
  }
}
