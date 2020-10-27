import { Server, Handler } from "../src/http.ts";

// Server that close himself on nth request
let number_of_requests = 0;
const server_l = new Server();
server_l.handle(() =>
  ++number_of_requests > 3
    ? server_l.close()
    : { body: `${number_of_requests}` }
);
server_l.listen({ port: 3000 });

// Persistent server
const handler: Handler = ({ url, method }) => ({ body: `${url} :: ${method}` });
const server = new Server(handler, { port: 3001 });
