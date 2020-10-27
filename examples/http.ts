import { Server, Handler } from "../src/http.ts";

const handler: Handler = ({ url, method }) => ({ body: `${url} :: ${method}` });

// Create the server
const server = new Server(handler);
server.listen({ port: 3000 });

// TODO Close the server
