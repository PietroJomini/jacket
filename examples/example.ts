import { Server, Router, types, ensure } from "../mod.ts";
import { Controller } from "../src/controller.ts";

const server = new Server();
const router = new Router();

const schema = types.object({
  name: types.string,
  age: types.string2number,
});

const c = new Controller(schema)
  .use(({ query }) => console.log(query))
  .group(
    "validate age",
    ({ query: { age } }) => age >= 18,
    ({ payload }) => ensure(payload, { msg: "age must be > 18" }),
  )
  .endpoint(({ query: { age, name } }) => `${name} is ${age} yo`);

router.get("/", c);

server.route(router);
server.listen({ port: 3000 });
